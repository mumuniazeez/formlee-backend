/*
  Warnings:

  - Made the column `description` on table `forms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "forms" ALTER COLUMN "description" SET NOT NULL;
