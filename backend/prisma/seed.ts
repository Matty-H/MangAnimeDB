// prisma/seed.ts
import { PrismaClient, WorkStatus, AnimeFidelity, RelationType } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const jsonData = JSON.parse(fs.readFileSync('shared/data/datascenario.json', 'utf-8'));

async function main() {
  for (const item of jsonData) {
    const license = await prisma.license.upsert({
      where: { externalId: item.id },
      update: {},
      create: {
        externalId: item.id,
        title: item.title,
      },
    });

    // Manga
    if (item.manga) {
      const manga = await prisma.mangaWork.create({
        data: {
          externalId: item.manga.id,
          licenseId: license.id,
          authors: item.manga.authors,
          title: license.title,
          volumes: item.manga.volumes,
          status: item.manga.status.toUpperCase() as WorkStatus,
          startDate: item.manga.start_date ? new Date(item.manga.start_date) : null,
          endDate: item.manga.end_date ? new Date(item.manga.end_date) : null,
          publisher: item.manga.publisher,
        },
      });

      // Anime adaptations
      for (const anime of item.anime_adaptations || []) {
        if ('seasons' in anime) {
          // Cas particulier pour The Promised Neverland
          const adaptation = await prisma.animeWork.create({
            data: {
              externalId: anime.id,
              licenseId: license.id,
              title: anime.title,
              studio: anime.studio,
              episodes: anime.seasons.reduce((acc, s) => acc + s.episodes, 0),
              status: 'COMPLETED',
              startDate: new Date(anime.seasons[0].start_date),
              endDate: new Date(anime.seasons[anime.seasons.length - 1].end_date),
              fidelity: 'PARTIAL', // Cas mixte
              relationType: RelationType.ORIGINAL,
              seasons: {
                create: anime.seasons.map((s) => ({
                  seasonNumber: s.season,
                  episodes: s.episodes,
                  fidelity: s.fidelity.toUpperCase() as AnimeFidelity,
                  coverageFromVolume: s.coverage?.manga_volumes?.[0] ?? null,
                  coverageToVolume: s.coverage?.manga_volumes?.[1] ?? null,
                  notes: s.notes,
                  relationType: s.relation_type?.toUpperCase() as RelationType,
                })),
              },
            },
          });

          for (const s of anime.seasons) {
            if (s.coverage?.manga_volumes) {
              await prisma.mangaToAnime.create({
                data: {
                  mangaId: manga.id,
                  animeAdaptationId: adaptation.id,
                  coverageFromVolume: s.coverage.manga_volumes[0],
                  coverageToVolume: s.coverage.manga_volumes[1],
                },
              });
            }
          }
        } else {
          const adaptation = await prisma.animeWork.create({
            data: {
              externalId: anime.id,
              licenseId: license.id,
              title: anime.title,
              studio: anime.studio,
              episodes: anime.episodes,
              status: anime.status.toUpperCase() as WorkStatus,
              startDate: anime.start_date ? new Date(anime.start_date) : null,
              endDate: anime.end_date ? new Date(anime.end_date) : null,
              fidelity: anime.fidelity.toUpperCase() as AnimeFidelity,
              relationType: anime.relation_type.toUpperCase() as RelationType,
              notes: anime.notes,
            },
          });

          if (anime.coverage?.manga_volumes) {
            await prisma.mangaToAnime.create({
              data: {
                mangaId: manga.id,
                animeAdaptationId: adaptation.id,
                coverageFromVolume: anime.coverage.manga_volumes[0],
                coverageToVolume: anime.coverage.manga_volumes[1],
              },
            });
          }
        }
      }
    }
  }

  console.log('🌱 Seeding terminé');
}

main()
  .catch((e) => {
    console.error('Erreur de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
