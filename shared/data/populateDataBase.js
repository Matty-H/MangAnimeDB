import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

// 📄 Chargement du JSON
const dataPath = 'src/data/datascenario.json';
console.log(dataPath);
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 🔌 Connexion PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'manga_anime_db',
  password: 'admin', // <-- change-moi
  port: 5432,
});

async function populateDB() {
  try {
    await client.connect();
    console.log('🚀 Connecté à la base PostgreSQL');

    for (const item of jsonData) {
      // 1. manga_anime
      await client.query(
        'INSERT INTO manga_anime (id, title) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
        [item.id, item.title],
      );

      // 2. manga
      if (item.manga) {
        const {
          id,
          volumes,
          status,
          start_date,
          end_date,
          publisher,
          authors,
        } = item.manga;
        await client.query(
          `INSERT INTO manga (id, manga_anime_id, volumes, status, start_date, end_date, publisher)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [
            id,
            item.id,
            volumes,
            status,
            start_date || null,
            end_date || null,
            publisher,
          ],
        );

        // 3. auteurs
        for (const author of authors || []) {
          await client.query(
            'INSERT INTO manga_authors (manga_id, name) VALUES ($1, $2)',
            [id, author],
          );
        }
      }

      // 4. anime adaptations
      if (item.anime_adaptations) {
        const adaptations = item.anime_adaptations.flatMap((adapt) => {
          if (adapt.seasons) {
            return adapt.seasons.map((season) => ({
              ...season,
              id: `${adapt.id}_S${season.season}`,
              parent_id: adapt.id,
              title: adapt.title,
              studio: adapt.studio,
              relation_type: season.relation_type || adapt.relation_type,
              related_to: season.related_to || adapt.related_to,
            }));
          }
          return [adapt];
        });

        for (const adapt of adaptations) {
          await client.query(
            `INSERT INTO anime_adaptations
            (id, manga_anime_id, title, studio, episodes, start_date, end_date, status, fidelity, notes, relation_type, related_to)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO NOTHING`,
            [
              adapt.id,
              item.id,
              adapt.title,
              adapt.studio,
              adapt.episodes || null,
              fixDate(adapt.start_date) || null,
              fixDate(adapt.end_date) || null,
              adapt.status,
              adapt.fidelity,
              adapt.notes,
              adapt.relation_type || null,
              adapt.related_to || null,
            ],
          );

          // 5. couverture
          if (adapt.coverage?.manga_volumes?.length === 2) {
            await client.query(
              `INSERT INTO coverage (adaptation_id, volume_start, volume_end)
              VALUES ($1, $2, $3)`,
              [
                adapt.id,
                adapt.coverage.manga_volumes[0],
                adapt.coverage.manga_volumes[1],
              ],
            );
          }

          // 6. divergence
          if (adapt.divergence_point) {
            await client.query(
              `INSERT INTO divergence_point (adaptation_id, manga_volume, description)
              VALUES ($1, $2, $3)`,
              [
                adapt.id,
                adapt.divergence_point.manga_volume,
                adapt.divergence_point.description,
              ],
            );
          }
        }
      }
    }

    console.log('✅ Données insérées avec succès !');
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
  } finally {
    await client.end();
    console.log('🔌 Déconnecté de la base');
  }
}

function fixDate(dateStr) {
  // Si la date est au format "YYYY-MM", ajoute "-01" pour la rendre valide
  if (dateStr && dateStr.length === 7) {
    return `${dateStr}-01`; // Exemple : "2001-07" -> "2001-07-01"
  }
  return dateStr;
}

populateDB();
