import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

// Fonction pour ajouter un commentaire au début d'un fichier
function addCommentToFile(filePath) {
  const absolutePath = resolve(filePath);
  const comment = `// Path: ${absolutePath}\n`;

  // Lire le contenu du fichier
  const content = readFileSync(absolutePath, 'utf8');

  // Ajouter le commentaire en tête
  const newContent = comment + content;

  // Écrire le nouveau contenu dans le fichier
  writeFileSync(absolutePath, newContent);
  console.log(`Commentaire ajouté à ${absolutePath}`);
}

// Exemple d'ajout automatique pour tous les fichiers TypeScript dans un dossier
function addCommentToAllTsFiles(dir) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      addCommentToAllTsFiles(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      addCommentToFile(fullPath);
    }
  });
}

// Spécifier le dossier du projet (ex: src/server)
const projectFolder = './MangAnimeDB';
addCommentToAllTsFiles(projectFolder);
