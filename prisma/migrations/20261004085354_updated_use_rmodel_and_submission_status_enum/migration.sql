/*
  Warnings:

  - The values [not delivered,delivery failed] on the enum `SubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'super-admin');

-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionStatus_new" AS ENUM ('delivered', 'pending', 'not-delivered', 'delivery-failed');
ALTER TABLE "public"."submissions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "submissions" ALTER COLUMN "status" TYPE "SubmissionStatus_new" USING ("status"::text::"SubmissionStatus_new");
ALTER TYPE "SubmissionStatus" RENAME TO "SubmissionStatus_old";
ALTER TYPE "SubmissionStatus_new" RENAME TO "SubmissionStatus";
DROP TYPE "public"."SubmissionStatus_old";
ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'not-delivered';
COMMIT;

-- AlterTable
ALTER TABLE "submissions" ALTER COLUMN "status" SET DEFAULT 'not-delivered';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
