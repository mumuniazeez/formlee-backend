/*
  Warnings:

  - You are about to drop the column `referer` on the `submissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[polar_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "submissions" DROP COLUMN "referer",
ADD COLUMN     "referrer" TEXT NOT NULL DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "polar_customer_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_polar_customer_id_key" ON "users"("polar_customer_id");
