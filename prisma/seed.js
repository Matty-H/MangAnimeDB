// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  try {
    // Charger le fichier JSON
    const data = JSON.parse(
      readFileSync(join(__dirname, '../data.json'), 'utf8'),
    );

    for (const item of data) {
      // Créer le MangaAnime
      const mangaAnime = await prisma.mangaAnime.create({
        data: {
          title: item.title,
        },
      });

      // Si l'entrée a des données de manga
      if (item.manga) {
        // Créer le Manga
        const manga = await prisma.manga.create({
          data: {
            mangaAnimeId: mangaAnime.id,
            volumes: item.manga.volumes,
            status: item.manga.status,
            startDate: item.manga.start_date
              ? new Date(item.manga.start_date)
              : null,
            endDate: item.manga.end_date ? new Date(item.manga.end_date) : null,
            publisher: item.manga.publisher,
          },
        });

        // Créer les auteurs du manga
        if (item.manga.authors && Array.isArray(item.manga.authors)) {
          for (const authorName of item.manga.authors) {
            await prisma.mangaAuthor.create({
              data: {
                mangaId: manga.id,
                name: authorName,
              },
            });
          }
        }
      }

      // Ajouter les adaptations animées
      if (item.anime_adaptations && Array.isArray(item.anime_adaptations)) {
        for (const adaptation of item.anime_adaptations) {
          // Pour gérer le cas spécial de The Promised Neverland qui a des saisons
          if (adaptation.seasons && Array.isArray(adaptation.seasons)) {
            for (const season of adaptation.seasons) {
              const animeAdaptation = await prisma.animeAdaptation.create({
                data: {
                  mangaAnimeId: mangaAnime.id,
                  title: `${adaptation.title} Season ${season.season}`,
                  studio: adaptation.studio,
                  episodes: season.episodes,
                  startDate: season.start_date
                    ? new Date(season.start_date)
                    : null,
                  endDate: season.end_date ? new Date(season.end_date) : null,
                  status: 'completed', // Hypothèse basée sur les données
                  fidelity: season.fidelity || null,
                  notes: season.notes || null,
                  relationType: season.relation_type || 'original',
                  relatedTo: season.related_to || null,
                },
              });

              // Ajouter les coverages
              if (season.coverage && season.coverage.manga_volumes) {
                await prisma.coverage.create({
                  data: {
                    adaptationId: animeAdaptation.id,
                    volumeStart: season.coverage.manga_volumes[0],
                    volumeEnd:
                      season.coverage.manga_volumes[1] ||
                      season.coverage.manga_volumes[0],
                  },
                });
              }

              // Ajouter les points de divergence
              if (season.divergence_point) {
                await prisma.divergencePoint.create({
                  data: {
                    adaptationId: animeAdaptation.id,
                    mangaVolume: season.divergence_point.manga_volume,
                    description: season.divergence_point.description,
                  },
                });
              }
            }
          } else {
            // Traitement normal pour les autres adaptations
            const animeAdaptation = await prisma.animeAdaptation.create({
              data: {
                mangaAnimeId: mangaAnime.id,
                title: adaptation.title,
                studio: adaptation.studio,
                episodes: adaptation.episodes,
                startDate: adaptation.start_date
                  ? new Date(adaptation.start_date)
                  : null,
                endDate: adaptation.end_date
                  ? new Date(adaptation.end_date)
                  : null,
                status: adaptation.status || null,
                fidelity: adaptation.fidelity || null,
                notes: adaptation.notes || null,
                relationType: adaptation.relation_type || null,
                relatedTo: adaptation.related_to || null,
              },
            });

            // Ajouter les coverages
            if (adaptation.coverage && adaptation.coverage.manga_volumes) {
              await prisma.coverage.create({
                data: {
                  adaptationId: animeAdaptation.id,
                  volumeStart: adaptation.coverage.manga_volumes[0],
                  volumeEnd:
                    adaptation.coverage.manga_volumes[1] ||
                    adaptation.coverage.manga_volumes[0],
                },
              });
            }

            // Ajouter les points de divergence
            if (adaptation.divergence_point) {
              await prisma.divergencePoint.create({
                data: {
                  adaptationId: animeAdaptation.id,
                  mangaVolume: adaptation.divergence_point.manga_volume,
                  description: adaptation.divergence_point.description,
                },
              });
            }
          }
        }
      }
    }

    console.log('La base de données a été peuplée avec succès !');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
