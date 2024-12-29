-- CreateTable
CREATE TABLE "upload_scoreboard" (
    "id" INTEGER NOT NULL,
    "upload_count" INTEGER DEFAULT 0,

    CONSTRAINT "upload_scoreboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "bucket_name" VARCHAR(255) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "date_created" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "upload_scoreboard" ADD CONSTRAINT "fk_reports_id" FOREIGN KEY ("id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

