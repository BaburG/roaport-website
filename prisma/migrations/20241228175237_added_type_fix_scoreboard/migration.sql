/*
  Warnings:

  - You are about to drop the column `upload_count` on the `upload_scoreboard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `upload_scoreboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `upload_scoreboard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "upload_scoreboard" DROP CONSTRAINT "fk_reports_id";

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "detail" TEXT,
ADD COLUMN     "type" VARCHAR(255),
ADD COLUMN     "username" VARCHAR(255) NOT NULL,
ADD COLUMN     "verified" TIMESTAMP(3);

-- AlterTable
CREATE SEQUENCE upload_scoreboard_id_seq;
ALTER TABLE "upload_scoreboard" DROP COLUMN "upload_count",
ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "username" VARCHAR(255) NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('upload_scoreboard_id_seq');
ALTER SEQUENCE upload_scoreboard_id_seq OWNED BY "upload_scoreboard"."id";

-- CreateIndex
CREATE UNIQUE INDEX "upload_scoreboard_username_key" ON "upload_scoreboard"("username");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_username_fkey" FOREIGN KEY ("username") REFERENCES "upload_scoreboard"("username") ON DELETE CASCADE ON UPDATE CASCADE;




-- MANUALLY ADDED TRIGGERS

CREATE OR REPLACE FUNCTION update_scoreboard_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO upload_scoreboard (username, total)
    VALUES (NEW.username, 1)
    ON CONFLICT (username) DO UPDATE
    SET total = upload_scoreboard.total + 1;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE upload_scoreboard
    SET total = total - 1
    WHERE username = OLD.username;

    DELETE FROM upload_scoreboard
    WHERE username = OLD.username AND total <= 0;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_total_trigger
AFTER INSERT OR DELETE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_scoreboard_total();


CREATE OR REPLACE FUNCTION ensure_scoreboard_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the user exists in UploadScoreboard
  INSERT INTO upload_scoreboard (username, total)
  VALUES (NEW.username, 0)
  ON CONFLICT (username) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_scoreboard_exists_trigger
BEFORE INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION ensure_scoreboard_exists();
