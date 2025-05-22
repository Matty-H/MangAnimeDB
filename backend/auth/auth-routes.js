import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET || !process.env.AUTH_SECRET) {
  console.error("⚠️ Variables d'environnement manquantes pour l'authentification");
}

// Fonction pour analyser la chaîne ROLE_EMAILS du .env
function parseRoleEmails() {
  const roleEmailsStr = process.env.ROLE_EMAILS || '';
  const roleEmailsMap = {};
  
  if (roleEmailsStr) {
    const pairs = roleEmailsStr.split(',');
    pairs.forEach(pair => {
      const [role, email] = pair.trim().split(':');
      if (role && email) {
        roleEmailsMap[email.trim()] = role.trim();
      }
    });
  }
  
  return roleEmailsMap;
}

// Obtenir le rôle d'un utilisateur en fonction de son email
function getUserRole(email) {
  const roleEmails = parseRoleEmails();
  return roleEmails[email] || 'guest'; // 'guest' est le rôle par défaut
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
  callbacks: {
    async session({ session }) {
      // On garde uniquement l'email, l'image et on ajoute le rôle dans la session
      return {
        expires: session.expires,
        user: {
          email: session.user?.email,
          image: session.user?.image,
          role: session.user?.email ? getUserRole(session.user.email) : 'guest'
        }
      };
    }
  }
});