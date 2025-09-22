/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_name_key" ON "public"."Profile"("userId", "name");
