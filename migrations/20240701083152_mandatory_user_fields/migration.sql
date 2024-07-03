/*
  Warnings:

  - Made the column `name` on table `lessers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `lessers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `lessers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `renters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `renters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `renters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "lessers" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "renters" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
