/*
  Warnings:

  - A unique constraint covering the columns `[leetCodeUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "leetCodeUsername" TEXT;

-- CreateTable
CREATE TABLE "LeetCodeUser" (
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAvatar" TEXT NOT NULL,

    CONSTRAINT "LeetCodeUser_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeUser_createdAt_key" ON "LeetCodeUser"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeUser_updatedAt_key" ON "LeetCodeUser"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_leetCodeUsername_key" ON "User"("leetCodeUsername");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leetCodeUsername_fkey" FOREIGN KEY ("leetCodeUsername") REFERENCES "LeetCodeUser"("username") ON DELETE CASCADE ON UPDATE CASCADE;
