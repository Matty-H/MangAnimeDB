/*
  Warnings:

  - Added the required column `adaptationType` to the `anime_adaptations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdaptationType" AS ENUM ('TV_SERIES', 'MOVIE', 'OVA', 'ONA', 'SPECIAL');

-- AlterTable
ALTER TABLE "anime_adaptations" ADD COLUMN     "adaptationType" "AdaptationType" NOT NULL,
ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "episodes" DROP NOT NULL;

-- CreateTable
CREATE TABLE "manga_parts" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "mangaId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "partNumber" INTEGER NOT NULL,
    "volumes" INTEGER NOT NULL,
    "startVolume" INTEGER NOT NULL,
    "endVolume" INTEGER NOT NULL,
    "status" "WorkStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manga_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga_part_to_anime" (
    "id" TEXT NOT NULL,
    "mangaPartId" TEXT NOT NULL,
    "animeAdaptationId" TEXT NOT NULL,
    "coverageComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manga_part_to_anime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manga_parts_externalId_key" ON "manga_parts"("externalId");

-- AddForeignKey
ALTER TABLE "manga_parts" ADD CONSTRAINT "manga_parts_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "mangas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga_parts" ADD CONSTRAINT "manga_parts_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga_part_to_anime" ADD CONSTRAINT "manga_part_to_anime_mangaPartId_fkey" FOREIGN KEY ("mangaPartId") REFERENCES "manga_parts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga_part_to_anime" ADD CONSTRAINT "manga_part_to_anime_animeAdaptationId_fkey" FOREIGN KEY ("animeAdaptationId") REFERENCES "anime_adaptations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
