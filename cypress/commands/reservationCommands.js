// cypress/commands/reservationCommands.js
// Custom commands para reservas usando Page Object
import reservationPage from '../pages/reservationPage';

Cypress.Commands.add('completarReserva', (datos) => {
  reservationPage.buscarDisponibilidad();
  reservationPage.seleccionarPrimeraHabitacion();
  reservationPage.irAResumenReserva();
  reservationPage.completarFormulario(datos);
});

Cypress.Commands.add('seleccionarFecha', (diasInicio = 1, diasFin = 3) => {
  reservationPage.seleccionarFechas(diasInicio, diasFin);
});

// Flujo completo: fechas + reserva
Cypress.Commands.add('flujoReservaExitosa', (diasInicio, diasFin, datos) => {
  reservationPage.visit();
  reservationPage.seleccionarFechas(diasInicio, diasFin);
  cy.intercept('POST', '**/api/booking').as('crearReserva');
  cy.completarReserva(datos);
  cy.wait('@crearReserva').its('response.statusCode').should('eq', 201);
  reservationPage.verConfirmacionReserva();
});