import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function setupAuthPages(app) {
  const authRoutes = ['login', 'logout', 'error', 'verify-request'];
  
  authRoutes.forEach(route => {
    app.get(`/auth/${route}`, (req, res) => {
      if (route === 'error' && req.query.error) {
        console.error('[AUTH ERROR]', req.query.error);
      }
      res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
  });
}