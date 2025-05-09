import React from 'react';
import ReactDOM from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ClerkProvider } from '@clerk/clerk-react'
import Header from './components/ui/header';
import { EditModeProvider } from './components/ui/EditModeContext';
import './style.css';


const PUBLISHABLE_KEY = (import.meta as any).env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
const router = createRouter({ routeTree });

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
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <EditModeProvider>
          <Header />
          <RouterProvider router={router} />
        </EditModeProvider>
      </ClerkProvider>
    </React.StrictMode>,
  );
}
