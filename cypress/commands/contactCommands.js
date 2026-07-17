// cypress/commands/contactCommands.js
import contactPage from '../pages/contactPage';

Cypress.Commands.add('flujoContactoExitoso', (datos) => {
  contactPage.visit();
  cy.intercept('POST', '**/api/message').as('enviarMensaje');
  contactPage.completarFormulario(datos);
  cy.wait('@enviarMensaje').its('response.statusCode').should('eq', 200);
  contactPage.verConfirmacion();
});