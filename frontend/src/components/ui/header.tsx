import React, { useEffect, useState } from "react";

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

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("selectedTheme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("selectedTheme", selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="absolute top-2 right-2 z-50">
      <details className="dropdown dropdown-left dropdown-start">
        <summary className="btn btn-xs italic rounded-lg p-5">Themes</summary>
        <div className="dropdown-content bg-base-100 border border-base-300 rounded-lg shadow-md p-3 flex gap-2 max-h-sm">
          {themes.map(({ name, color }) => (
            <button
              key={name}
              onClick={() => setSelectedTheme(name)}
              title={name}
              className={`w-5 h-5 rounded-full border ${
                selectedTheme === name ? "border-black" : "border-gray-300"
              } hover:opacity-80 cursor-pointer`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </details>
    </div>
  );
};

export default ThemeSelector;
