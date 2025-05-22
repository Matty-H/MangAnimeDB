import { getSession } from "@auth/express";
import dotenv from 'dotenv';

dotenv.config();

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
  
  console.log("🔍 Mapping des rôles et emails:", roleEmailsMap);
  return roleEmailsMap;
}

// Obtenir le rôle d'un utilisateur en fonction de son email
function getUserRole(email) {
  const roleEmails = parseRoleEmails();
  const role = roleEmails[email] || 'guest';
  console.log(`🔍 Rôle obtenu pour ${email}: ${role}`);
  return role;
}

const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [],
};

export async function authenticatedUser(req, res, next) {
  try {
    let session;
    
    // Utilise la session déjà récupérée si elle existe
    if (res.locals.session) {
      session = res.locals.session;
    } else {
      session = await getSession(req, authConfig);
    }
    
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    // Ajouter le rôle à l'utilisateur si ce n'est pas déjà fait
    if (session.user && !session.user.role) {
      session.user.role = getUserRole(session.user.email);
    }
    
    req.session = session;
    res.locals.session = session;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'authentification" });
  }
}

export function checkRole(role) {
  return async (req, res, next) => {
    try {
      let session;
      
      if (res.locals.session) {
        session = res.locals.session;
      } else {
        session = await getSession(req, authConfig);
      }
      
      if (!session) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      
      // Ajouter le rôle à l'utilisateur si ce n'est pas déjà fait
      if (session.user && !session.user.role) {
        session.user.role = getUserRole(session.user.email);
      }
      
      if (session.user?.role !== role) {
        return res.status(403).json({ message: `Accès refusé - Rôle ${role} requis` });
      }
      
      req.session = session;
      res.locals.session = session;
      next();
    } catch (error) {
      console.error("Erreur de vérification de rôle:", error);
      res.status(500).json({ message: "Erreur serveur lors de la vérification du rôle" });
    }
  };
}


// Exports d'alias
export const isAuthenticated = authenticatedUser;
export const isAdmin = checkRole('admin');
export const isEditor = checkRole('editor');
export const isUser = checkRole('user');