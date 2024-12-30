/*
  Warnings:

  - The `createdAt` column on the `DuoReview` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE `Posts` DROP FOREIGN KEY `Posts_profileId_fkey`;

-- DropIndex
DROP INDEX `Posts_profileId_key` ON `Posts`;

-- AlterTable
ALTER TABLE `DuoReview` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Posts` MODIFY `postImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Profiles` MODIFY `profileImage` VARCHAR(191) NULL;


