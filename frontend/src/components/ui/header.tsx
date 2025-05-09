import React, { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useEditMode } from "../ui/EditModeContext";
import { Pencil, PencilOff, Settings, PaintBucket } from "lucide-react";
import { userService } from "../../services/userService";

const themes = [
  { name: "light", color: "#FFFFFF" },
  { name: "cupcake", color: "#F3C5C5" },
  { name: "bumblebee", color: "#F7D800" },
  { name: "emerald", color: "#10B981" },
  { name: "corporate", color: "#3B82F6" },
  { name: "synthwave", color: "#8A2BE2" },
  { name: "retro", color: "#FF6347" },
  { name: "cyberpunk", color: "#00F9A8" },
  { name: "valentine", color: "#FF1493" },
  { name: "halloween", color: "#FF4500" },
  { name: "garden", color: "#4CAF50" },
  { name: "forest", color: "#2E8B57" },
  { name: "lofi", color: "#D3D3D3" },
  { name: "pastel", color: "#FFD1DC" },
  { name: "fantasy", color: "#D4AF37" },
  { name: "wireframe", color: "#D3D3D3" },
  { name: "luxury", color: "#000000" },
  { name: "dracula", color: "#282A36" },
  { name: "cmyk", color: "#F6A800" },
  { name: "autumn", color: "#F4A300" },
  { name: "business", color: "#1E40AF" },
  { name: "night", color: "#1E1E1E" },
  { name: "coffee", color: "#6B4226" },
  { name: "winter", color: "#00BFFF" },
  { name: "dim", color: "#2F4F4F" },
  { name: "nord", color: "#2E3440" },
  { name: "sunset", color: "#FF6347" },
  { name: "caramellatte", color: "#D2B48C" },
  { name: "silk", color: "#F5F5F5" },
];

const Header = () => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("selectedTheme") || "light";
  });
  
  const { isEditMode, toggleEditMode } = useEditMode();
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  
  // Vérifier si l'utilisateur est admin via notre API REST
  useEffect(() => {
    const checkAdminRole = async () => {
      setIsAdminLoading(true);
      try {
        if (isLoaded && user) {
          // Vérifier le rôle admin via l'API
          const adminStatus = await userService.checkIsAdmin();
          console.log("Statut admin:", adminStatus);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle admin:", error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };
    
    checkAdminRole();
  }, [user, isLoaded]);
  
  // Fonction pour gérer le basculement du mode d'édition
  const handleEditToggle = () => {
    toggleEditMode();
  };
  
  // Effet pour gérer le raccourci clavier Ctrl+E
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Vérifier si l'utilisateur est admin et si la combinaison est Ctrl+E
      if (isAdmin && event.ctrlKey && event.key === 'e') {
        // Empêcher le comportement par défaut du navigateur (par exemple, ouvrir la recherche dans certains navigateurs)
        event.preventDefault();
        // Basculer le mode édition
        toggleEditMode();
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener('keydown', handleKeyDown);

    // Nettoyer l'écouteur d'événement lors du démontage du composant
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleEditMode, isAdmin]);
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
  }, [selectedTheme]);
  
  return (
    <header className="bg-base-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-2">
        {/* Logo / Brand section - peut être ajouté ici */}
        <div className="flex-1">
          {/* Espace réservé pour logo ou titre */}
        </div>
        
        {/* Actions section */}
        <div className="flex items-center space-x-3">
          {/* Settings Dropdown */}
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
              <Settings size={20} />
            </button>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-64 p-4 shadow-lg mt-2">
              {/* Thème sélecteur */}
              <div className="mb-4">
                <PaintBucket size={16}/>
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
              
              {/* Mode d'édition (visible uniquement pour les admins) */}
              {!isAdminLoading && isAdmin && (
                <div className="py-2 border-t border-base-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {isEditMode ? <Pencil size={16} /> : <PencilOff size={16} />}
                      <span>Mode édition</span>
                    </span>
                    <label className="toggle toggle-sm">
                      <input
                        type="checkbox"
                        checked={isEditMode}
                        onChange={handleEditToggle}
                      />
                      <span className="toggle-mark"></span>
                    </label>
                    <span className="text-xs text-base-content/60 ml-2">Ctrl+E</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* User Authentication */}
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-sm btn-primary">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;