/*
  Warnings:

  - You are about to drop the column `ip` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `submissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `submissions` table. All the data in the column will be lost.
  - Added the required column `data` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "ip",
DROP COLUMN "payload",
DROP COLUMN "updatedAt",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAgent" TEXT NOT NULL;
