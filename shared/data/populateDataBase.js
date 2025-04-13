import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const dataPath = 'shared/data/datascenario.json';
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function parseDate(dateStr) {
  return dateStr ? new Date(dateStr) : null;
}

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

    if (item.manga) {
      const manga = await prisma.mangaWork.create({
        data: {
          externalId: item.manga.id,
          licenseId: license.id,
          authors: item.manga.authors,
          volumes: item.manga.volumes,
          status: item.manga.status.toUpperCase(),
          startDate: parseDate(item.manga.start_date),
          endDate: parseDate(item.manga.end_date),
          publisher: item.manga.publisher,
        },
      });

      // anime adaptations
      if (item.anime_adaptations) {
        for (const anime of item.anime_adaptations) {
          const animeEntry = await prisma.animeWork.create({
            data: {
              externalId: anime.id,
              licenseId: license.id,
              title: anime.title,
              studio: anime.studio,
              episodes: anime.episodes,
              startDate: parseDate(anime.start_date),
              endDate: parseDate(anime.end_date),
              status: anime.status.toUpperCase(),
              fidelity: anime.fidelity.toUpperCase(),
              notes: anime.notes || null,
              relationType: anime.relation_type.toUpperCase(),
            },
          });

          // lien many-to-many avec volumes couverts
          if (anime.coverage?.manga_volumes?.length > 0) {
            const from = anime.coverage.manga_volumes[0];
            const to = anime.coverage.manga_volumes[anime.coverage.manga_volumes.length - 1];
            await prisma.mangaToAnime.create({
              data: {
                mangaId: manga.id,
                animeAdaptationId: animeEntry.id,
                coverageFromVolume: from,
                coverageToVolume: to,
              },
            });
          }

          // saison (si structuré en saisons comme The Promised Neverland)
          if (anime.seasons) {
            for (const season of anime.seasons) {
              const seasonFrom = season.coverage?.manga_volumes?.[0];
              const seasonTo = season.coverage?.manga_volumes?.slice(-1)[0];
              await prisma.animeSeason.create({
                data: {
                  animeAdaptationId: animeEntry.id,
                  seasonNumber: season.season,
                  episodes: season.episodes,
                  fidelity: season.fidelity.toUpperCase(),
                  coverageFromVolume: seasonFrom,
                  coverageToVolume: seasonTo,
                  notes: season.notes || null,
                  relationType: season.relation_type?.toUpperCase() || null,
                },
              });
            }
          }
        }
      }
    }
  }
}

main()
  .then(() => {
    console.log('✅ Base peuplée avec succès');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Erreur :', e);
    prisma.$disconnect();
    process.exit(1);
  });
