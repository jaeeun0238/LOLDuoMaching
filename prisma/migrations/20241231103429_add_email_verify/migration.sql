-- AlterTable
ALTER TABLE `Users` ADD COLUMN `emailVerify` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationCode` VARCHAR(191) NULL;
