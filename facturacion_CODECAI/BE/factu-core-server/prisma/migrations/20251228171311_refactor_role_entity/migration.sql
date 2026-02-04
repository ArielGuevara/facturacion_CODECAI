/*
  Warnings:

  - You are about to drop the column `rolId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_rolId_fkey";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "rolId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Rol";

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
