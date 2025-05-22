import React from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/ui/header';
import { EditModeProvider } from './components/ui/EditModeContext';
import './style.css';

const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => <div>Aïe Aïe Aïe la boulette 😱 \n{JSON.stringify(error)}</div>,
  defaultNotFoundComponent: () => <div className='text-center font-bold p-10'>Page introuvable 🤷</div>,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}


const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <EditModeProvider>
          <Header />
          <RouterProvider router={router} />
        </EditModeProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}