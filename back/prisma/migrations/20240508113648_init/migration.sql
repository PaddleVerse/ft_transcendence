-- CreateEnum
CREATE TYPE "Appearance" AS ENUM ('protected', 'private', 'public');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MOD', 'MEMBER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'IN_GAME');

-- CreateEnum
CREATE TYPE "Req" AS ENUM ('RECIVED', 'SEND');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "N_Type" AS ENUM ('MESSAGE', 'REQUEST');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "googleId" TEXT,
    "fortytwoId" INTEGER,
    "nickname" TEXT NOT NULL,
    "name" TEXT,
    "middlename" TEXT DEFAULT 'zuse',
    "password" TEXT NOT NULL,
    "picture" TEXT DEFAULT 'https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713806275/kx6iknqyvu0uyqhhpfro.jpg',
    "banner_picture" TEXT DEFAULT 'https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713526102/zxwritc0rqvtjvcwbqiv.jpg',
    "status" "Status" NOT NULL DEFAULT 'OFFLINE',
    "xp" INTEGER DEFAULT 0,
    "level" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "twoFa" BOOLEAN DEFAULT false,
    "twoFaSecret" TEXT,
    "first_time" BOOLEAN DEFAULT true,
    "notified" BOOLEAN DEFAULT false,
    "coins" INTEGER DEFAULT 1000,
    "win_streak" INTEGER DEFAULT 0,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "friendId" INTEGER DEFAULT 0,
    "status" "FriendshipStatus" NOT NULL,
    "request" "Req" DEFAULT 'SEND',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER DEFAULT 0,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_history" (
    "id" SERIAL NOT NULL,
    "winner" INTEGER DEFAULT 0,
    "loser" INTEGER DEFAULT 0,
    "winner_score" INTEGER DEFAULT 0,
    "loser_score" INTEGER DEFAULT 0,
    "winner_streak" INTEGER DEFAULT 0,
    "start_time" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),

    CONSTRAINT "game_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "picture" TEXT DEFAULT 'https://res.cloudinary.com/dxxlqdwxb/image/upload/v1713806275/kx6iknqyvu0uyqhhpfro.jpg',
    "topic" TEXT DEFAULT 'here to have fun and make friends, no toxicity allowed',
    "key" TEXT,
    "state" "Appearance" DEFAULT 'public',
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER,
    "sender_id" INTEGER DEFAULT 0,
    "sender_picture" TEXT,
    "conversation_id" INTEGER,
    "content" TEXT,
    "content_type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ban_list" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "channel_id" INTEGER DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ban_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_participant" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "channel_id" INTEGER DEFAULT 0,
    "role" "Role" DEFAULT 'MEMBER',
    "mute" BOOLEAN DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation" (
    "id" SERIAL NOT NULL,
    "user_a_id" INTEGER DEFAULT 0,
    "user_b_id" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "sender_name" TEXT,
    "sender_picture" TEXT,
    "sender_id" INTEGER DEFAULT 0,
    "type" "N_Type",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paddle" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "image" TEXT,
    "color" TEXT,
    "enabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paddle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ball" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "image" TEXT,
    "texture" TEXT DEFAULT '/Game/textures/balls/default.jpg',
    "color" TEXT,
    "enabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ball_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER DEFAULT 0,
    "image" TEXT,
    "color" TEXT,
    "enabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_googleId_key" ON "user"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_fortytwoId_key" ON "user"("fortytwoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_nickname_key" ON "user"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_key" ON "channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "paddle_color_key" ON "paddle"("color");

-- CreateIndex
CREATE UNIQUE INDEX "ball_color_key" ON "ball"("color");

-- CreateIndex
CREATE UNIQUE INDEX "table_color_key" ON "table"("color");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_list" ADD CONSTRAINT "ban_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ban_list" ADD CONSTRAINT "ban_list_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_participant" ADD CONSTRAINT "channel_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_participant" ADD CONSTRAINT "channel_participant_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paddle" ADD CONSTRAINT "paddle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball" ADD CONSTRAINT "ball_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table" ADD CONSTRAINT "table_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
