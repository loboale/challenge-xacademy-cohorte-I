// cypress/pages/contactPage.js
// Page Object para el formulario de contacto - Shady Meadows
// Ahora usando data-testid proporcionados por la aplicación

class ContactPage {
  elements = {
    // Inputs del formulario (usando data-testid)
    nameInput: () => cy.get('[data-testid="ContactName"]'),
    emailInput: () => cy.get('[data-testid="ContactEmail"]'),
    phoneInput: () => cy.get('[data-testid="ContactPhone"]'),
    subjectInput: () => cy.get('[data-testid="ContactSubject"]'),
    messageInput: () => cy.get('[data-testid="ContactDescription"]'),
    submitBtn: () => cy.contains('button', 'Submit'),
    // Mensaje de confirmación (texto real: "Thanks for getting in touch Alexis!")
    confirmationMsg: () => cy.contains('Thanks for getting in touch')
  }

  visit() {
    cy.visit('/');
  }

  completarFormulario(datos) {
    this.elements.nameInput().type(datos.name);
    this.elements.emailInput().type(datos.email);
    this.elements.phoneInput().type(datos.phone);
    this.elements.subjectInput().type(datos.subject);
    this.elements.messageInput().type(datos.message);
    this.elements.submitBtn().click();
  }

  verConfirmacion() {
    this.elements.confirmationMsg().should('be.visible');
  }
}

export default new ContactPage();