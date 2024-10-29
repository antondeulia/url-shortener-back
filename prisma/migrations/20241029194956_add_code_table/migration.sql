/*
  Warnings:

  - Added the required column `code` to the `shortened_urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shortened_urls" ADD COLUMN     "code" TEXT NOT NULL;
