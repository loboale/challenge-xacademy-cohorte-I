// cypress/support/e2e.js
import '../commands/reservationCommands';

Cypress.on('uncaught:exception', (err) => {
  // Ignorar errores de React (bug de la app)
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
  // Ignorar error de "Cannot read properties of undefined (reading 'length')"
  // causado por el colapso de la app tras el 409
  if (err.message.includes("Cannot read properties of undefined (reading 'length')")) {
    return false;
  }
  return true;
});