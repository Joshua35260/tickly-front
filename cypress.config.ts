import { defineConfig } from "cypress";
import { environment } from "environments/environment";

const apiUrl = environment.frontUrl;

export default defineConfig({
  e2e: {
    baseUrl: apiUrl,
    setupNodeEvents(on, config) {
      // Implémentez les écouteurs d'événements ici si nécessaire
      return config; // Assurez-vous de retourner la configuration
    },
  },
});
