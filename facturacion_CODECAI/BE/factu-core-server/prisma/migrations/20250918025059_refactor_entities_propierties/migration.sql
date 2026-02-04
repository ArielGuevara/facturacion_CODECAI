/*
  Warnings:

  - You are about to drop the column `mail` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `mail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_shopId_fkey";

-- DropIndex
DROP INDEX "public"."User_mail_key";

-- AlterTable
ALTER TABLE "public"."Shop" DROP COLUMN "mail",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "mail",
DROP COLUMN "shopId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."_ShopToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ShopToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ShopToUser_B_index" ON "public"."_ShopToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."_ShopToUser" ADD CONSTRAINT "_ShopToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ShopToUser" ADD CONSTRAINT "_ShopToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
