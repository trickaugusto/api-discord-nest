/*
  Warnings:

  - You are about to drop the column `created_by` on the `Bot` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" DROP COLUMN "created_by",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
