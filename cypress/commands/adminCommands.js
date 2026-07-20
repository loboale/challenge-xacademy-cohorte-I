// cypress/commands/adminCommands.js
import adminPage from '../pages/adminPage';

Cypress.Commands.add('loginAdmin', (username, password) => {
  adminPage.visit();
  adminPage.login(username, password);
  adminPage.verificarLoginExitoso();
});