/*
  Warnings:

  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "table" DROP CONSTRAINT "table_user_id_fkey";

-- DropTable
DROP TABLE "table";

-- CreateTable
CREATE TABLE "blacklistedTokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklistedTokens_pkey" PRIMARY KEY ("id")
);
