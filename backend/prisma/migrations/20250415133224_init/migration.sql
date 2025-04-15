-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS', 'UNFINISHED');

-- CreateEnum
CREATE TYPE "AnimeFidelity" AS ENUM ('FAITHFUL', 'PARTIAL', 'ANIME_ORIGINAL');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('ORIGINAL', 'SEQUEL', 'PREQUEL', 'REMAKE', 'SPIN_OFF', 'REBOOT');

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mangas" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "licenseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "volumes" INTEGER NOT NULL,
    "status" "WorkStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "publisher" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mangas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_adaptations" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "licenseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "studio" TEXT NOT NULL,
    "episodes" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "WorkStatus" NOT NULL,
    "fidelity" "AnimeFidelity" NOT NULL,
    "notes" TEXT,
    "relationType" "RelationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anime_adaptations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga_to_anime" (
    "id" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "animeAdaptationId" TEXT NOT NULL,
    "coverageFromVolume" INTEGER,
    "coverageToVolume" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manga_to_anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_seasons" (
    "id" TEXT NOT NULL,
    "animeAdaptationId" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodes" INTEGER NOT NULL,
    "fidelity" "AnimeFidelity" NOT NULL,
    "coverageFromVolume" INTEGER,
    "coverageToVolume" INTEGER,
    "notes" TEXT,
    "relationType" "RelationType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anime_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "licenses_externalId_key" ON "licenses"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "mangas_externalId_key" ON "mangas"("externalId");

-- CreateIndex
CREATE INDEX "mangas_title_idx" ON "mangas"("title");

-- CreateIndex
CREATE UNIQUE INDEX "anime_adaptations_externalId_key" ON "anime_adaptations"("externalId");

-- AddForeignKey
ALTER TABLE "mangas" ADD CONSTRAINT "mangas_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_adaptations" ADD CONSTRAINT "anime_adaptations_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga_to_anime" ADD CONSTRAINT "manga_to_anime_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "mangas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manga_to_anime" ADD CONSTRAINT "manga_to_anime_animeAdaptationId_fkey" FOREIGN KEY ("animeAdaptationId") REFERENCES "anime_adaptations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_seasons" ADD CONSTRAINT "anime_seasons_animeAdaptationId_fkey" FOREIGN KEY ("animeAdaptationId") REFERENCES "anime_adaptations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
