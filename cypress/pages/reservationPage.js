// cypress/pages/reservationPage.js
// Page Object para el módulo de Reservas - Shady Meadows
// Nota: La página no usa data-test. Usamos selectores semánticos.

class ReservationPage {
  // Selectores privados
  elements = {
    // Inputs de fecha del buscador principal
    checkinInput: () => cy.get(':nth-child(1) > .react-datepicker-wrapper input'),
    checkoutInput: () => cy.get(':nth-child(2) > .react-datepicker-wrapper input'),
    checkAvailabilityBtn: () => cy.contains('button', 'Check Availability'),
    
    // Usamos un selector más abarcativo porque la app no tiene data-test.
    // Buscamos el texto 'Book now' dentro del contenedor de habitaciones.
    firstRoomBookBtn: () => cy.get('#rooms > .container > .row').contains('Book now'),

    // Formulario de reserva
    reserveNowBtn: () => cy.contains('button', 'Reserve Now'),
    firstNameInput: () => cy.get('input[name="firstname"]'),
    lastNameInput: () => cy.get('input[name="lastname"]'),
    emailInput: () => cy.get('input[name="email"]'),
    phoneInput: () => cy.get('input[name="phone"]'),
    
    // Confirmación
    bookingConfirmedMsg: () => cy.contains('Booking Confirmed')
  }

  // --- Métodos de acción ---

  // Navegar a la página principal
  visit() {
    cy.visit('/');
  }

  // Seleccionar fechas en el buscador
  seleccionarFechas(diasInicio = 1, diasFin = 3) {
    const hoy = new Date();
    const checkin = new Date(hoy);
    checkin.setDate(hoy.getDate() + diasInicio);
    const checkout = new Date(hoy);
    checkout.setDate(hoy.getDate() + diasFin);

    const formatear = (fecha) => fecha.toISOString().split('T')[0];

    this.elements.checkinInput().clear().type(formatear(checkin));
    this.elements.checkoutInput().clear().type(formatear(checkout));
  }

  // Hacer clic en "Check Availability"
  buscarDisponibilidad() {
    this.elements.checkAvailabilityBtn().click();
  }

  // Interceptar y esperar la carga de habitaciones
  esperarCargaHabitaciones() {
    cy.intercept('GET', '**/api/room?*').as('cargarHabitaciones');
    this.elements.checkAvailabilityBtn().click();
    cy.wait('@cargarHabitaciones');
  }

  // Seleccionar la primera habitación disponible
  seleccionarPrimeraHabitacion() {
    this.elements.firstRoomBookBtn().click();
  }

  // Hacer clic en "Reserve Now" del resumen
  irAResumenReserva() {
    this.elements.reserveNowBtn().click();
  }

  // Llenar el formulario de reserva (campos opcionales)
  completarFormulario(datos = {}) {
    if (datos.firstname !== undefined) this.elements.firstNameInput().type(datos.firstname);
    if (datos.lastname !== undefined) this.elements.lastNameInput().type(datos.lastname);
    if (datos.email !== undefined) this.elements.emailInput().type(datos.email);
    if (datos.phone !== undefined) this.elements.phoneInput().type(datos.phone);
    this.elements.reserveNowBtn().click();
  }

  // Hacer clic en "Reserve Now" sin llenar campos (para probar validaciones)
  hacerClickEnReserveNow() {
    this.elements.reserveNowBtn().click();
  }

  // Verificar que la reserva fue confirmada
  verConfirmacionReserva() {
    this.elements.bookingConfirmedMsg().should('be.visible');
  }

  verNoConfirmacionReserva() {
    this.elements.bookingConfirmedMsg().should('not.exist');
  }
}

// Exportamos una única instancia de la página
export default new ReservationPage();