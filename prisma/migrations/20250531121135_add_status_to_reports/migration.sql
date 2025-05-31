/*
  Warnings:

  - You are about to drop the `reports_prod` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "status" VARCHAR(255) DEFAULT 'PENDING';

-- DropTable
DROP TABLE "reports_prod";

-- DropEnum
DROP TYPE "ReportStatus";

-- DropEnum
DROP TYPE "ReportType";

-- DropEnum
DROP TYPE "VerifiedBy";
