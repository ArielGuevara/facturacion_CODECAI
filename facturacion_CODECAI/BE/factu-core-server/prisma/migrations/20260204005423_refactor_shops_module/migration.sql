/*
  Warnings:

  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShopToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ShopToUser" DROP CONSTRAINT "_ShopToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShopToUser" DROP CONSTRAINT "_ShopToUser_B_fkey";

-- DropTable
DROP TABLE "public"."Shop";

-- DropTable
DROP TABLE "public"."_ShopToUser";

-- CreateTable
CREATE TABLE "public"."shops" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_shops" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_shops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shops_ruc_key" ON "public"."shops"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "shops_email_key" ON "public"."shops"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_shops_userId_shopId_key" ON "public"."user_shops"("userId", "shopId");

-- AddForeignKey
ALTER TABLE "public"."user_shops" ADD CONSTRAINT "user_shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_shops" ADD CONSTRAINT "user_shops_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
