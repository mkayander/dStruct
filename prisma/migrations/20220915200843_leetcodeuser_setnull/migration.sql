-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_leetCodeUsername_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leetCodeUsername_fkey" FOREIGN KEY ("leetCodeUsername") REFERENCES "LeetCodeUser"("username") ON DELETE SET NULL ON UPDATE CASCADE;
