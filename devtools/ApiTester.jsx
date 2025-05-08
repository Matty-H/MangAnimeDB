// src/components/ApiDebugger.jsx
import { useState } from "react";

const routes = [
  { label: "Créer un anime", method: "POST", path: "/anime", hasBody: true },
  { label: "Récupérer un anime", method: "GET", path: "/anime/:id" },
  { label: "Mettre à jour un anime", method: "PUT", path: "/anime/:id", hasBody: true },

  { label: "Créer une saison", method: "POST", path: "/anime/season", hasBody: true },
  { label: "Mettre à jour une saison", method: "PUT", path: "/anime/season/:id", hasBody: true },
  { label: "Supprimer une saison", method: "DELETE", path: "/anime/season/:id" },

  { label: "Récupérer un manga", method: "GET", path: "/manga/:id" },
  { label: "Créer un manga", method: "POST", path: "/manga", hasBody: true },
  { label: "Mettre à jour un manga", method: "PUT", path: "/manga/:id", hasBody: true },
  {
    label: "Mettre à jour via licence",
    method: "PUT",
    path: "/manga/license/:licenseId/manga/:mangaId",
    hasBody: true,
  },

  { label: "Créer une partie de manga", method: "POST", path: "/manga/part", hasBody: true },
  { label: "Mettre à jour une partie", method: "PUT", path: "/manga/part/:id", hasBody: true },
  { label: "Supprimer une partie", method: "DELETE", path: "/manga/part/:id" },

  { label: "Lister les licences", method: "GET", path: "/license" },
  { label: "Créer une licence", method: "POST", path: "/license", hasBody: true },
  { label: "Mettre à jour une licence", method: "PUT", path: "/license/:id", hasBody: true },
  { label: "Supprimer une licence", method: "DELETE", path: "/license/:id" },

  { label: "Suggestions de recherche", method: "GET", path: "/search/suggestions" },
  { label: "Recherche détaillée", method: "GET", path: "/search/detailed" },
];

export default function ApiDebugger() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [params, setParams] = useState({});
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const baseURL = "http://localhost:3000/api";

  const buildURL = () => {
    let path = selectedRoute.path;
    for (const key in params) {
      path = path.replace(`:${key}`, params[key]);
    }
    return baseURL + path;
  };

  const extractParams = (path) => {
    const matches = [...path.matchAll(/:([^/]+)/g)];
    const extracted = {};
    matches.forEach((match) => {
      extracted[match[1]] = "";
    });
    return extracted;
  };

  const handleRouteChange = (e) => {
    const route = routes[e.target.value];
    setSelectedRoute(route);
    setParams(extractParams(route.path));
    setBody("{}");
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    const url = buildURL();
    const options = {
      method: selectedRoute.method,
      headers: { "Content-Type": "application/json" },
    };

    if (selectedRoute.hasBody) {
      options.body = body;
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw data;
      setResponse(data);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Testeur d'API</h1>

      <div>
        <label className="block font-medium">Route :</label>
        <select onChange={handleRouteChange} className="border p-2 w-full">
          {routes.map((r, i) => (
            <option key={i} value={i}>
              {r.method} {r.path} — {r.label}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(params).length > 0 && (
        <div>
          <h2 className="font-medium">Paramètres de l'URL :</h2>
          {Object.keys(params).map((key) => (
            <input
              key={key}
              className="border p-2 mr-2 mt-2"
              placeholder={key}
              value={params[key]}
              onChange={(e) => setParams({ ...params, [key]: e.target.value })}
            />
          ))}
        </div>
      )}

      {selectedRoute.hasBody && (
        <div>
          <label className="block font-medium mt-2">Body JSON :</label>
          <textarea
            className="w-full border p-2 h-40 font-mono"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Envoyer la requête
      </button>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Réponse :</h2>
        {response && <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(response, null, 2)}</pre>}
        {error && <pre className="bg-red-100 p-4 rounded text-red-800">{JSON.stringify(error, null, 2)}</pre>}
      </div>
    </div>
  );
}
