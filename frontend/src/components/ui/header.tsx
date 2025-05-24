// frontend/src/components/ui/header.tsx (version simplifiée)
import React, { useEffect, useState } from "react";
import { Settings, PaintBucket, Pencil, PencilOff } from "lucide-react";
import { useEditMode } from "../ui/EditModeContext";
import { userService } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { AuthUser } from "../../types";
import { themes } from '../../themes';

const Header = () => {
  // État du thème sélectionné
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("selectedTheme") || "light";
    }
    return "light";
  });

  // État du mode édition
  const { isEditMode, toggleEditMode } = useEditMode();

  // États pour vérifier si l'utilisateur est admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  // États liés à Auth.js
  const { session, loading, isAuthenticated, signOut } = useAuth();

  // Obtenir le nom d'affichage ou la première lettre de l'email de l'utilisateur
  const getUserDisplayName = (user?: AuthUser | null): string => {
    if (!user) return '?';
    return user.name?.charAt(0) || user.email?.charAt(0) || '?';
  };

  // Vérifier si l'utilisateur est admin via notre API REST
  useEffect(() => {
    const checkAdminRole = async () => {
      setIsAdminLoading(true);
      try {
        if (!loading && isAuthenticated && session?.user) {
          // Vérifier le rôle admin via l'API
          const adminStatus = await userService.checkIsAdmin();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [session, loading, isAuthenticated]);

  // Fonction pour gérer le basculement du mode d'édition
  const handleEditToggle = () => {
    toggleEditMode();
  };

  // Effet pour gérer le raccourci clavier Ctrl+E
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Vérifier si l'utilisateur est admin et si la combinaison est Ctrl+E
      if (isAdmin && event.ctrlKey && event.key === 'e') {
        // Empêcher le comportement par défaut du navigateur
        event.preventDefault();
        // Basculer le mode édition
        toggleEditMode();
      }
    };

    // Ajouter l'écouteur d'événement
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
    }

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [toggleEditMode, isAdmin]);

  // Appliquer le thème sélectionné
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("selectedTheme", selectedTheme);
    }
  }, [selectedTheme]);

  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-2">
        {/* Logo / Brand section */}
        <div className="flex-1">
          {/* Espace réservé pour logo ou titre */}
        </div>
  
        {/* Actions section */}
        <div className="flex items-center space-x-3">
          {/* Theme Selector Dropdown */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              <PaintBucket size={20} />
            </button>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-64 p-4 shadow-lg mt-2">
              <div className="flex items-center gap-2 mb-2">
                <PaintBucket size={16}/>
                <span>Thème</span>
              </div>
              <div className="max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                {themes.map(({ name, color }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedTheme(name)}
                    className={`py-1 px-2 rounded text-left transition-all text-sm ${
                      selectedTheme === name ? "bg-base-200 font-bold" : "hover:bg-base-200"
                    }`}
                  >
                    <span
                      style={{
                        color: color,
                        textShadow: (name === "light" || name === "silk") ? "0 0 3px rgba(0,0,0,0.75)" : "none"
                      }}
                    >
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Mode Button (visible uniquement pour les admins) */}
          {!isAdminLoading && isAdmin && (
            <div className="tooltip tooltip-bottom" data-tip={`Mode édition ${isEditMode ? 'activé' : 'désactivé'} (Ctrl+E)`}>
              <button 
                onClick={handleEditToggle}
                className={`btn btn-ghost btn-circle ${isEditMode ? 'text-primary' : ''}`}
              >
                {isEditMode ? <Pencil size={20} /> : <PencilOff size={20} />}
              </button>
            </div>
          )}

          {/* User Display (if authenticated) */}
          {!loading && isAuthenticated && session?.user && (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                {session.user.image ? (
                  <div className="w-8 h-8 rounded-full">
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar utilisateur"}
                      className="w-full h-full rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-medium">
                    {getUserDisplayName(session.user)}
                  </div>
                )}
              </button>
              <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                <li className="font-medium text-xs opacity-70 px-4 py-1 bg-base-300 rounded-md mb-1">
                  {session.user.email}
                </li>
                <li><button onClick={signOut}>Déconnexion</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;