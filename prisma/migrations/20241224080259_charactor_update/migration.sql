/*
  Warnings:

  - You are about to drop the `Chanpions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Chanpions`;

-- CreateTable
CREATE TABLE `Champions` (
    `chanpionId` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`chanpionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
