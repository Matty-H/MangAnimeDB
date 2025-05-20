import { getSession } from "@auth/express";
import dotenv from 'dotenv';

dotenv.config();

const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export async function authenticatedUser(req, res, next) {
  try {
    const session = res.locals.session || await getSession(req, authConfig);
    if (!session) {
      return res.status(401).json({ message: "Non authentifié" });
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
      const session = res.locals.session || await getSession(req, authConfig);
      if (!session) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      if (session.user.role !== role) {
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