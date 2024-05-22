/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `blacklistedTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blacklistedTokens_token_key" ON "blacklistedTokens"("token");
