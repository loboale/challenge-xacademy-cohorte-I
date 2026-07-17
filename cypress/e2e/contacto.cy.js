// cypress/e2e/contacto.cy.js
// Módulo de Contacto - Shady Meadows
// Challenge Final QA Automation - Team Aragón (Solo Edition)
import contactPage from '../pages/contactPage';

describe('Módulo de Contacto - Shady Meadows', () => {

  // TC-Cont-01: Envío exitoso del formulario de contacto
  it('TC-Cont-01: Envío exitoso del formulario de contacto', () => {
    cy.fixture('contacto').then((contacto) => {
      cy.flujoContactoExitoso(contacto.contactoValido);
    });
  });

  // TC-Cont-02: Formulario vacío muestra errores de validación
  it('TC-Cont-02: Formulario vacío muestra errores de validación', () => {
    contactPage.visit();
    contactPage.elements.submitBtn().click();
    
    cy.get('.col-lg-8 > .card > .card-body').within(() => {
      cy.contains('Name may not be blank').should('be.visible');
      cy.contains('Email may not be blank').should('be.visible');
      cy.contains('Message may not be blank').should('be.visible');
      cy.contains('Phone must be between 11 and 21 characters').should('be.visible');
    });
  });

  // TC-Cont-03: Teléfono con caracteres alfabéticos (bug)
  it('TC-Cont-03: Teléfono con caracteres alfabéticos (bug - API responde 200)', () => {
    cy.fixture('contacto').then((contacto) => {
      const datos = contacto.contactoTelefonoLetras;
      contactPage.visit();
      cy.intercept('POST', '**/api/message').as('enviarMensajeLetras');
      contactPage.completarFormulario(datos);
      // Bug: el sistema acepta letras en el teléfono
      cy.wait('@enviarMensajeLetras').its('response.statusCode').should('eq', 200);
      contactPage.verConfirmacion();
      cy.screenshot('bug-contacto-telefono-letras');
    });
  });

  // TC-Cont-04: Name con caracteres numéricos (bug)
  it('TC-Cont-04: Name con caracteres numéricos (bug - API responde 200)', () => {
    cy.fixture('contacto').then((contacto) => {
      const datos = contacto.contactoNombreNumeros;
      contactPage.visit();
      cy.intercept('POST', '**/api/message').as('enviarMensajeNumeros');
      contactPage.completarFormulario(datos);
      // Bug: el sistema acepta números en el nombre
      cy.wait('@enviarMensajeNumeros').its('response.statusCode').should('eq', 200);
      contactPage.verConfirmacion();
      cy.screenshot('bug-contacto-name-numeros');
    });
  });

  // TC-Cont-05: Email con formato inválido (bug)
  it('TC-Cont-05: Email con formato inválido (bug - API responde 200)', () => {
    cy.fixture('contacto').then((contacto) => {
      const datos = contacto.contactoEmailInvalido;
      contactPage.visit();
      cy.intercept('POST', '**/api/message').as('enviarMensajeEmail');
      contactPage.completarFormulario(datos);
      // Bug: el sistema acepta "usuario@a" como email válido
      cy.wait('@enviarMensajeEmail').its('response.statusCode').should('eq', 200);
      contactPage.verConfirmacion();
      cy.screenshot('bug-contacto-email-invalido');
    });
  });

  // TC-Cont-06: Message supera los 2000 caracteres (validación correcta - API responde 400)
  it('TC-Cont-06: Message supera los 2000 caracteres (API rechaza con 400)', () => {
    cy.fixture('contacto').then((contacto) => {
        const datos = contacto.contactoValido;
        // Generamos un mensaje de más de 2000 caracteres
        const mensajeLargo = 'A'.repeat(2001);
        
        contactPage.visit();
        cy.intercept('POST', '**/api/message').as('enviarMensajeLargo');
        
        // Completamos el formulario con el mensaje largo
        contactPage.elements.nameInput().type(datos.name);
        contactPage.elements.emailInput().type(datos.email);
        contactPage.elements.phoneInput().type(datos.phone);
        contactPage.elements.subjectInput().type(datos.subject);
        contactPage.elements.messageInput().type(mensajeLargo);
        contactPage.elements.submitBtn().click();
        
        // La API debe rechazar el envío (400 Bad Request)
        cy.wait('@enviarMensajeLargo').its('response.statusCode').should('eq', 400);
        
        // Verificamos que NO se muestre el mensaje de confirmación
        contactPage.elements.confirmationMsg().should('not.exist');
        
        // Opcional: verificar que aparezca un mensaje de error de longitud
        // (si la UI lo muestra, podemos agregarlo; si no, es otro bug)
    });
  });
});