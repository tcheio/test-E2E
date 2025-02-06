const { defineConfig } = require("cypress");

module.exports = defineConfig({
    defaultCommandTimeout: 10000, // Augmente le timeout à 10 secondes
    pageLoadTimeout: 60000, // Timeout du chargement de page (60 sec)

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
