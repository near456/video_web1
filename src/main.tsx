import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import { ContactsProvider } from './contexts/contactsContext.tsx';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ContactsProvider>
        <App />
        <Toaster position="top-right" />
      </ContactsProvider>
    </BrowserRouter>
  </StrictMode>
);
