-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('delivered', 'pending', 'not delivered');

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "message" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'not delivered';
