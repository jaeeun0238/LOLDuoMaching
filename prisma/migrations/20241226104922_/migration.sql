/*
  Warnings:

  - The primary key for the `ChatRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to alter the column `content` on the `ChatRoom` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.
  - You are about to drop the column `like` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `usersUserId` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `mostPlay` on the `Profiles` table. All the data in the column will be lost.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[profileId]` on the table `Posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId_1` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId_2` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likeCount` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `championId` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mostPlay1` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mostPlay2` to the `Profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mostPlay3` to the `Profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ChatRoom` DROP FOREIGN KEY `ChatRoom_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `ChatRoom` DROP FOREIGN KEY `ChatRoom_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `DuoReview` DROP FOREIGN KEY `DuoReview_myUserId_fkey`;

-- DropForeignKey
ALTER TABLE `DuoReview` DROP FOREIGN KEY `DuoReview_someoneUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Posts` DROP FOREIGN KEY `Posts_usersUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Profiles` DROP FOREIGN KEY `Profiles_userId_fkey`;

-- DropIndex
DROP INDEX `ChatRoom_profileId_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `ChatRoom_userId_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `Comments_userId_fkey` ON `Comments`;

-- DropIndex
DROP INDEX `DuoReview_myUserId_fkey` ON `DuoReview`;

-- DropIndex
DROP INDEX `DuoReview_someoneUserId_fkey` ON `DuoReview`;

-- DropIndex
DROP INDEX `Posts_usersUserId_fkey` ON `Posts`;

-- DropIndex
DROP INDEX `Profiles_userId_fkey` ON `Profiles`;

-- AlterTable
ALTER TABLE `ChatRoom` DROP PRIMARY KEY,
    DROP COLUMN `profileId`,
    DROP COLUMN `userId`,
    ADD COLUMN `userId_1` BIGINT NOT NULL,
    ADD COLUMN `userId_2` BIGINT NOT NULL,
    MODIFY `chatRoomId` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `content` BIGINT NOT NULL,
    ADD PRIMARY KEY (`chatRoomId`);

-- AlterTable
ALTER TABLE `Comments` MODIFY `userId` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `DuoReview` MODIFY `myUserId` BIGINT NOT NULL,
    MODIFY `someoneUserId` BIGINT NOT NULL,
    MODIFY `createdAt` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `Posts` DROP COLUMN `like`,
    DROP COLUMN `usersUserId`,
    ADD COLUMN `likeCount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Profiles` DROP COLUMN `mostPlay`,
    ADD COLUMN `championId` BIGINT NOT NULL,
    ADD COLUMN `mostPlay1` VARCHAR(191) NOT NULL,
    ADD COLUMN `mostPlay2` VARCHAR(191) NOT NULL,
    ADD COLUMN `mostPlay3` VARCHAR(191) NOT NULL,
    MODIFY `userId` BIGINT NOT NULL,
    ALTER COLUMN `averageRating` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    MODIFY `userId` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- CreateTable
CREATE TABLE `Champions` (
    `championId` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Champions_image_key`(`image`),
    UNIQUE INDEX `Champions_name_key`(`name`),
    PRIMARY KEY (`championId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `likeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `postId` INTEGER NOT NULL,

    UNIQUE INDEX `likes_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`likeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreeBoard` (
    `freeBordId` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`freeBordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Posts_profileId_key` ON `Posts`(`profileId`);

-- CreateIndex
CREATE UNIQUE INDEX `Profiles_userId_key` ON `Profiles`(`userId`);

-- AddForeignKey
ALTER TABLE `Profiles` ADD CONSTRAINT `Profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_userId_1_fkey` FOREIGN KEY (`userId_1`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_userId_2_fkey` FOREIGN KEY (`userId_2`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DuoReview` ADD CONSTRAINT `DuoReview_myUserId_fkey` FOREIGN KEY (`myUserId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DuoReview` ADD CONSTRAINT `DuoReview_someoneUserId_fkey` FOREIGN KEY (`someoneUserId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Posts`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeBoard` ADD CONSTRAINT `FreeBoard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
