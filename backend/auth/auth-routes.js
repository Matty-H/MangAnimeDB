import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET || !process.env.AUTH_SECRET) {
  console.error("⚠️ Variables d'environnement manquantes pour l'authentification");
}

export default ExpressAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  ],
  secret: process.env.AUTH_SECRET,
  debug: true,
});