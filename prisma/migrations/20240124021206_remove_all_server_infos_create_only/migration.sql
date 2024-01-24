/*
  Warnings:

  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_owner_id_fkey";

-- DropTable
DROP TABLE "Server";
