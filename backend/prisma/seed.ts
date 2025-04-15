// prisma/seed.ts
import { PrismaClient, WorkStatus, AnimeFidelity, RelationType, AdaptationType } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const jsonData = JSON.parse(fs.readFileSync('shared/data/datascenario.json', 'utf-8'));

async function main() {
  for (const item of jsonData) {
    // Create or update License
    const license = await prisma.license.upsert({
      where: { externalId: item.id },
      update: {},
      create: {
        externalId: item.id,
        title: item.title,
      },
    });

    // Create Manga if it exists
    let manga;
    if (item.manga) {
      manga = await prisma.mangaWork.create({
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

      // Create MangaParts if they exist
      const mangaPartMap = {};
      if (item.manga_parts && item.manga_parts.length > 0) {
        for (const part of item.manga_parts) {
          const mangaPart = await prisma.mangaPart.create({
            data: {
              externalId: part.id,
              mangaId: manga.id,
              licenseId: license.id,
              title: part.title,
              partNumber: part.partNumber,
              volumes: part.volumes,
              startVolume: part.startVolume,
              endVolume: part.endVolume,
              status: part.status as WorkStatus,
              startDate: part.start_date ? new Date(part.start_date) : null,
              endDate: part.end_date ? new Date(part.end_date) : null,
            },
          });
          mangaPartMap[part.id] = mangaPart.id;
        }
      }

      // Process anime adaptations
      for (const anime of item.anime_adaptations || []) {
        // Determine the adaptation type
        let adaptationType: AdaptationType = AdaptationType.TV_SERIES;
        if (anime.adaptationType) {
          // Convertir la chaîne en enum AdaptationType
          switch (anime.adaptationType) {
            case 'TV_SERIES':
              adaptationType = AdaptationType.TV_SERIES;
              break;
            case 'MOVIE':
              adaptationType = AdaptationType.MOVIE;
              break;
            case 'OVA':
              adaptationType = AdaptationType.OVA;
              break;
            case 'ONA':
              adaptationType = AdaptationType.ONA;
              break;
            case 'SPECIAL':
              adaptationType = AdaptationType.SPECIAL;
              break;
            default:
              adaptationType = AdaptationType.TV_SERIES;
          }
        }

        if ('seasons' in anime) {
          // Handle anime with explicit seasons (like The Promised Neverland)
          const adaptation = await prisma.animeAdaptation.create({
            data: {
              externalId: anime.id,
              licenseId: license.id,
              title: anime.title,
              studio: anime.studio,
              adaptationType: adaptationType,
              episodes: anime.seasons.reduce((acc, s) => acc + s.episodes, 0),
              duration: anime.duration || null,
              status: 'COMPLETED',
              startDate: new Date(anime.seasons[0].start_date),
              endDate: new Date(anime.seasons[anime.seasons.length - 1].end_date),
              fidelity: 'PARTIAL', // Mixed case
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

          // Create MangaToAnime relations
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
          // Handle standard anime adaptations
          const adaptation = await prisma.animeAdaptation.create({
            data: {
              externalId: anime.id,
              licenseId: license.id,
              title: anime.title,
              studio: anime.studio,
              adaptationType: adaptationType,
              episodes: anime.episodes,
              duration: anime.duration || null,
              status: anime.status.toUpperCase() as WorkStatus,
              startDate: anime.start_date ? new Date(anime.start_date) : null,
              endDate: anime.end_date ? new Date(anime.end_date) : null,
              fidelity: anime.fidelity.toUpperCase() as AnimeFidelity,
              relationType: anime.relation_type.toUpperCase() as RelationType,
              notes: anime.notes,
            },
          });

          // Handle coverage - either at manga level or manga part level
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

          // Handle manga_part_coverage relations if they exist
          if (anime.manga_part_coverage && anime.manga_part_coverage.length > 0) {
            for (const coverage of anime.manga_part_coverage) {
              const mangaPartId = mangaPartMap[coverage.manga_part_id];
              
              if (mangaPartId) {
                await prisma.mangaPartToAnime.create({
                  data: {
                    mangaPartId: mangaPartId,
                    animeAdaptationId: adaptation.id,
                    coverageComplete: coverage.coverageComplete || false,
                  },
                });
              }
            }
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