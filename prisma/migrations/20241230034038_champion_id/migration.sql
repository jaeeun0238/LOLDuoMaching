/*
  Warnings:

  - The `createdAt` column on the `DuoReview` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `championId` on the `Profiles` table. All the data in the column will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lolNickname]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Posts` DROP FOREIGN KEY `Posts_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `Profiles` DROP FOREIGN KEY `Profiles_userId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_postId_fkey`;

-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_userId_fkey`;

-- DropIndex
DROP INDEX `Posts_profileId_key` ON `Posts`;

-- DropIndex
DROP INDEX `Profiles_userId_key` ON `Profiles`;

-- AlterTable
ALTER TABLE `DuoReview` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Posts` ADD COLUMN `postImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Profiles` DROP COLUMN `championId`,
    ADD COLUMN `profileImage` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `likes`;

-- CreateTable
CREATE TABLE `Likes` (
    `likeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    UNIQUE INDEX `Likes_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`likeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Profiles_lolNickname_key` ON `Profiles`(`lolNickname`);

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Posts`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;
