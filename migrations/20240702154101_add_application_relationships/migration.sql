/*
  Warnings:

  - You are about to drop the column `applications` on the `renters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "renters" DROP COLUMN "applications";

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,
    "applicantId" TEXT,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "lesserposts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "renters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
