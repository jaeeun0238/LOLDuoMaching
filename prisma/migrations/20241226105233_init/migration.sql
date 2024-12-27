/*
  Warnings:

  - The primary key for the `ChatRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `chatRoomId` on the `ChatRoom` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId_1` on the `ChatRoom` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId_2` on the `ChatRoom` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `Comments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `myUserId` on the `DuoReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `someoneUserId` on the `DuoReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `createdAt` on the `DuoReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `FreeBoard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `freeBordId` on the `FreeBoard` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `FreeBoard` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `Profiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `championId` on the `Profiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userId` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `likes` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `ChatRoom` DROP FOREIGN KEY `ChatRoom_userId_1_fkey`;

-- DropForeignKey
ALTER TABLE `ChatRoom` DROP FOREIGN KEY `ChatRoom_userId_2_fkey`;

-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `DuoReview` DROP FOREIGN KEY `DuoReview_myUserId_fkey`;

-- DropForeignKey
ALTER TABLE `DuoReview` DROP FOREIGN KEY `DuoReview_someoneUserId_fkey`;

-- DropForeignKey
ALTER TABLE `FreeBoard` DROP FOREIGN KEY `FreeBoard_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Profiles` DROP FOREIGN KEY `Profiles_userId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_userId_fkey`;

-- DropIndex
DROP INDEX `ChatRoom_userId_1_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `ChatRoom_userId_2_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `Comments_userId_fkey` ON `Comments`;

-- DropIndex
DROP INDEX `DuoReview_myUserId_fkey` ON `DuoReview`;

-- DropIndex
DROP INDEX `DuoReview_someoneUserId_fkey` ON `DuoReview`;

-- DropIndex
DROP INDEX `FreeBoard_userId_fkey` ON `FreeBoard`;

-- AlterTable
ALTER TABLE `ChatRoom` DROP PRIMARY KEY,
    MODIFY `chatRoomId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `userId_1` INTEGER NOT NULL,
    MODIFY `userId_2` INTEGER NOT NULL,
    ADD PRIMARY KEY (`chatRoomId`);

-- AlterTable
ALTER TABLE `Comments` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `DuoReview` MODIFY `myUserId` INTEGER NOT NULL,
    MODIFY `someoneUserId` INTEGER NOT NULL,
    MODIFY `createdAt` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `FreeBoard` DROP PRIMARY KEY,
    MODIFY `freeBordId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`freeBordId`);

-- AlterTable
ALTER TABLE `Profiles` MODIFY `userId` INTEGER NOT NULL,
    MODIFY `championId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    MODIFY `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`userId`);

-- AlterTable
ALTER TABLE `likes` MODIFY `userId` INTEGER NOT NULL;

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
ALTER TABLE `FreeBoard` ADD CONSTRAINT `FreeBoard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
