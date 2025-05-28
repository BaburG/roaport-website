-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('pothole', 'sign', 'sidewalk', 'other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('pending_verification', 'ML_verified', 'pending_human_verification', 'Verified', 'in_provision', 'repaired');

-- CreateEnum
CREATE TYPE "VerifiedBy" AS ENUM ('human', 'ai');

-- CreateTable
CREATE TABLE "reports_prod" (
    "Id" SERIAL NOT NULL,
    "Userid" UUID NOT NULL,
    "Long" DOUBLE PRECISION NOT NULL,
    "Lat" DOUBLE PRECISION NOT NULL,
    "bucket_name" VARCHAR(255),
    "file_name" VARCHAR(255),
    "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_at" TIMESTAMP(3),
    "Deleted_at" TIMESTAMP(3),
    "Type" "ReportType" NOT NULL,
    "Status" "ReportStatus" NOT NULL,
    "Verified_at" TIMESTAMP(3),
    "Verified_by" "VerifiedBy",
    "Detail" TEXT,

    CONSTRAINT "reports_prod_pkey" PRIMARY KEY ("Id")
);
