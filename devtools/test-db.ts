import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // // Étape 1 : Créer un manga_anime
  // const mangaAnime = await prisma.manga_anime.create({
  //   data: {
  //     title: 'Fullmetal Alchemist', // ou ce que tu veux
  //   },
  // });

  // // Étape 2 : Ajouter un manga lié à ce manga_anime
  // const newManga = await prisma.manga.create({
  //   data: {
  //     mangaAnimeId: mangaAnime.id, // ✅ clé étrangère valide
  //     volumes: 27,
  //     status: 'Terminé',
  //     startDate: new Date('2001-07-01'),
  //     endDate: new Date('2010-06-01'),
  //     publisher: 'Square Enix',
  //   },
  // });

  // console.log('✅ Manga ajouté:', newManga);

  // Étape 3 : Rechercher tous les mangas
  const mangas = await prisma.manga.findMany({
    include: { mangaAnime: true }, // pour voir la relation
  });
  console.log('📚 Mangas dans la base de données:', mangas);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
