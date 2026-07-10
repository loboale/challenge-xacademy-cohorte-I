// cypress/e2e/reservas.cy.js
// Módulo de Reservas - Shady Meadows
// Challenge Final QA Automation - Team Aragón (Solo Edition)
import reservationPage from '../pages/reservationPage';

describe('Módulo de Reservas - Shady Meadows', () => {

  // TC-Res-01: Reserva exitosa como usuario invitado
  it('TC-Res-01: Reserva exitosa con datos válidos', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoValido;
      reservationPage.visit();
      cy.get('.card').should('have.length.at.least', 1); // Verifica habitaciones visibles
      reservationPage.seleccionarFechas(1, 3);
      cy.intercept('POST', '**/api/booking').as('crearReserva');
      cy.completarReserva(datos);
      cy.wait('@crearReserva').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();
    });
  });

  // TC-Res-02: Intento de reserva con formulario vacío
  it('TC-Res-02: Formulario vacío muestra errores de validación', () => {
    reservationPage.visit();
    reservationPage.seleccionarFechas(4, 6);
    reservationPage.buscarDisponibilidad();
    reservationPage.seleccionarPrimeraHabitacion();
    reservationPage.irAResumenReserva();
    // No llenamos ningún campo, solo click en Reserve Now
    reservationPage.hacerClickEnReserveNow();
    cy.contains('size must be between 3 and 18').should('be.visible');
    cy.contains('size must be between 3 and 30').should('be.visible');
    cy.contains('must not be empty').should('be.visible');
  });

  // TC-Res-03: Validación de límites de caracteres (Nombre min: 3, Apellido max: 30)
  it('TC-Res-03: Límites de caracteres (Nombre min 3, Apellido max 30)', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoBorde;
      reservationPage.visit();
      reservationPage.seleccionarFechas(7, 9);
      cy.intercept('POST', '**/api/booking').as('crearReserva');
      cy.completarReserva(datos);
      cy.wait('@crearReserva').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();
    });
  });

  // TC-Res-04: Validación de límite inferior en el campo teléfono (10 dígitos)
  it('TC-Res-04: Teléfono con 10 dígitos muestra error y API responde 400', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoTelefono10;
      reservationPage.visit();
      reservationPage.seleccionarFechas(16, 18);
      cy.intercept('POST', '**/api/booking').as('crearReserva');
      cy.completarReserva(datos);
      cy.contains('size must be between 11 and 21').should('be.visible');
      cy.contains('Booking Confirmed').should('not.exist');
      cy.wait('@crearReserva').its('response.statusCode').should('eq', 400);
    });
  });

  // TC-Res-08: Intento de reserva con letras en el teléfono (BUG: API acepta 201)
  it('TC-Res-08: Teléfono con caracteres alfabéticos (bug - API responde 201)', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoTelefonoLetras;
      reservationPage.visit();
      reservationPage.seleccionarFechas(10, 12);
      cy.intercept('POST', '**/api/booking').as('crearReserva');
      cy.completarReserva(datos);
      // Bug: el sistema acepta el teléfono con letras y crea la reserva.
      // Debería responder 400 y mostrar un mensaje de validación.
      cy.wait('@crearReserva').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();
    });
  });

  // TC-Res-07: Fechas invertidas (checkout anterior a checkin) - bug 409
  it('TC-Res-07: Fechas invertidas provocan error 409 y pantalla negra', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoValido;

      reservationPage.visit();

      // Forzamos fechas invertidas: checkin futuro, checkout pasado
      const checkinValido = '2026-08-01';
      const checkoutInvalido = '2026-01-01';

      reservationPage.elements.checkinInput().clear().type(checkinValido);
      reservationPage.elements.checkoutInput().clear().type(checkoutInvalido);

      cy.intercept('POST', '**/api/booking').as('reservaInvertida');

      reservationPage.buscarDisponibilidad();
      reservationPage.seleccionarPrimeraHabitacion();
      reservationPage.irAResumenReserva();
      reservationPage.completarFormulario(datos);

      // Esperamos la respuesta de la API
      cy.wait('@reservaInvertida').its('response.statusCode').should('eq', 409);

      // Tomamos captura como evidencia del bug
      cy.screenshot('bug-fechas-invertidas-409');

      // Verificamos que NO se muestra mensaje de éxito
      reservationPage.verNoConfirmacionReserva();
    });
  });

  // TC-Res-09: Reserva duplicada provoca error 409 y pantalla negra
  it('TC-Res-09: Reserva duplicada (misma habitación y fechas) - bug 409', () => {
    cy.fixture('reservas').then((reservas) => {
      // 1. PRIMERA RESERVA (exitosa) para ocupar una fecha
      const datosPrimera = reservas.invitadoBugPantallaNegra;
      reservationPage.visit();
      reservationPage.seleccionarFechas(20, 22); // Fechas que usaremos para duplicar
      cy.intercept('POST', '**/api/booking').as('crearReservaInicial');
      cy.completarReserva(datosPrimera);
      cy.wait('@crearReservaInicial').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();

      // 2. SEGUNDA RESERVA (duplicada) con las mismas fechas y distinto usuario
      const datosBug = reservas.invitadoValido;
      reservationPage.visit();
      reservationPage.seleccionarFechas(20, 22);
      cy.intercept('POST', '**/api/booking').as('reservaDuplicada');
      cy.completarReserva(datosBug);

      // 3. Verificamos que la API responde 409 (Conflict) y documentamos
      cy.wait('@reservaDuplicada').its('response.statusCode').should('eq', 409);
      cy.screenshot('bug-reserva-duplicada-pantalla-negra');

      // 4. Verificamos que NO se muestra confirmación
      reservationPage.elements.bookingConfirmedMsg().should('not.exist');
    });
  });

  // TC-Res-05: Intento de reserva con fechas en el pasado (bug - API responde 201)
  it('TC-Res-05: Fechas en el pasado (bug - permite reservar estadías irreales)', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoValido;

      reservationPage.visit();

      // Forzamos fechas en el pasado
      const checkinPasado = '2025-01-01';
      const checkoutPasado = '2025-01-05';

      reservationPage.elements.checkinInput().clear().type(checkinPasado);
      reservationPage.elements.checkoutInput().clear().type(checkoutPasado);

      cy.intercept('POST', '**/api/booking').as('crearReservaPasada');

      reservationPage.buscarDisponibilidad();
      reservationPage.seleccionarPrimeraHabitacion();
      reservationPage.irAResumenReserva();
      reservationPage.completarFormulario(datos);

      // Bug: el sistema permite reservar fechas pasadas
      cy.wait('@crearReservaPasada').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();
      cy.screenshot('bug-fechas-pasadas-201');
    });
  });

  // TC-Res-06: Intento de reserva con correo incompleto (bug - API responde 201)
  it('TC-Res-06: Correo con formato incompleto (bug - API responde 201)', () => {
    cy.fixture('reservas').then((reservas) => {
      const datos = reservas.invitadoEmailInvalido;

      reservationPage.visit();
      reservationPage.seleccionarFechas(23, 25);
      cy.intercept('POST', '**/api/booking').as('crearReservaEmail');
      cy.completarReserva(datos);

      // Bug: el sistema acepta "usuario@a" como correo válido
      cy.wait('@crearReservaEmail').its('response.statusCode').should('eq', 201);
      reservationPage.verConfirmacionReserva();
      cy.screenshot('bug-correo-incompleto-201');
    });
  });

});