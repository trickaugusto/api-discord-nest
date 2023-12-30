-- DropForeignKey
ALTER TABLE "Bot" DROP CONSTRAINT "Bot_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
