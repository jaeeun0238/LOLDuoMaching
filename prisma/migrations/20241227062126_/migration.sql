-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profiles`(`profileId`) ON DELETE RESTRICT ON UPDATE CASCADE;
