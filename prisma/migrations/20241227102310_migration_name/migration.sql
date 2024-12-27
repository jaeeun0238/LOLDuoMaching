/*
  Warnings:

  - The primary key for the `Champions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chanpionId` on the `Champions` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `usersUserId` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `mostPlay` on the `Profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image]` on the table `Champions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Champions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lolNickname]` on the table `Profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `championId` to the `Champions` table without a default value. This is not possible if the table is not empty.
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
ALTER TABLE `Posts` DROP FOREIGN KEY `Posts_usersUserId_fkey`;

-- DropIndex
DROP INDEX `ChatRoom_profileId_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `ChatRoom_userId_fkey` ON `ChatRoom`;

-- DropIndex
DROP INDEX `Posts_usersUserId_fkey` ON `Posts`;

-- AlterTable
ALTER TABLE `Champions` DROP PRIMARY KEY,
    DROP COLUMN `chanpionId`,
    ADD COLUMN `championId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`championId`);

-- AlterTable
ALTER TABLE `ChatRoom` DROP COLUMN `profileId`,
    DROP COLUMN `userId`,
    ADD COLUMN `userId_1` INTEGER NOT NULL,
    ADD COLUMN `userId_2` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Posts` DROP COLUMN `like`,
    DROP COLUMN `usersUserId`,
    ADD COLUMN `likeCount` INTEGER NOT NULL,
    ADD COLUMN `postImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Profiles` DROP COLUMN `mostPlay`,
    ADD COLUMN `championId` INTEGER NOT NULL,
    ADD COLUMN `mostPlay1` VARCHAR(191) NOT NULL,
    ADD COLUMN `mostPlay2` VARCHAR(191) NOT NULL,
    ADD COLUMN `mostPlay3` VARCHAR(191) NOT NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL,
    ALTER COLUMN `averageRating` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Likes` (
    `likeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    UNIQUE INDEX `Likes_userId_postId_key`(`userId`, `postId`),
    PRIMARY KEY (`likeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreeBoard` (
    `freeBordId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`freeBordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Champions_image_key` ON `Champions`(`image`);

-- CreateIndex
CREATE UNIQUE INDEX `Champions_name_key` ON `Champions`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Profiles_lolNickname_key` ON `Profiles`(`lolNickname`);

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_userId_1_fkey` FOREIGN KEY (`userId_1`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRoom` ADD CONSTRAINT `ChatRoom_userId_2_fkey` FOREIGN KEY (`userId_2`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Posts`(`postId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeBoard` ADD CONSTRAINT `FreeBoard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
