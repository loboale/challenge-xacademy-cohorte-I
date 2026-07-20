// cypress/pages/adminPage.js
// Page Object para el panel de administración - Shady Meadows
// Usando los IDs proporcionados por la página (malas prácticas mediante)

class AdminPage {
  elements = {
    // Navegación
    adminLink: () => cy.contains('a', 'Admin'),

    // Login
    usernameInput: () => cy.get('#username'),
    passwordInput: () => cy.get('#password'),
    loginBtn: () => cy.get('#doLogin'),

    // Panel
    dashboardHeader: () => cy.contains('h2', 'Dashboard')
  }

  visit() {
    cy.visit('/');
    this.elements.adminLink().click();
  }

  login(username, password) {
    this.elements.usernameInput().type(username);
    this.elements.passwordInput().type(password);
    this.elements.loginBtn().click();
  }

  verificarLoginExitoso() {
    // La prueba de oro: después de un login exitoso, siempre vamos a /admin/rooms
    //cy.url().should('include', '/admin/rooms');
    
    // Opcional: validar que se ve un elemento clave de la página de Rooms
    cy.get('.navbar').contains('Rooms').should('be.visible');
  }

  verificarLoginFallido() {
    // Esperamos ver un mensaje de error visible. Según tu exploración previa, el sistema muestra "Invalid credentials".
    cy.contains('Invalid credentials', { matchCase: false }).should('be.visible');
  }

  // Navegar a la sección de creación (si no estamos ya)
  // Según tu aclaración, al loguear ya estamos en /admin/rooms, 
  // pero podríamos necesitar hacer clic en "Create Room" si existe.
  navegarACrearHabitacion() {
    // Por si acaso, nos aseguramos de estar en la URL correcta
    cy.url().should('include', '/admin/rooms');
    // Si hubiera un botón "Create Room" para abrir el formulario, lo clickearíamos aquí.
    // Por ahora, asumo que el formulario ya está visible.
  }

  // Llenar y enviar el formulario de creación
  crearHabitacion(datos) {
    // Usamos los selectores que investigaste
    cy.get('[data-testid="roomName"]').type(datos.roomNumber);
    cy.get('#type').select(datos.type || 'Single'); // Usamos 'select' para dropdowns
    cy.get('#roomPrice').clear().type(datos.price);
    
    // Checkbox de WiFi
    if (datos.wifi) {
      cy.get('.form-check > [name="featureCheck"]').check();
    }
    
    // El botón Create usa el ID que me pasaste
    cy.get('#createRoom').click();
  }

  // Verificar que la habitación se creó
  verificarHabitacionCreada(roomNumber) {
    // Después de crear, la página debería volver a la lista de habitaciones.
    cy.url().should('include', '/admin/rooms');
    // Verificamos que el número de habitación aparece en la lista
    cy.get('#root-container > :nth-child(1)').contains(roomNumber).should('be.visible');
  }

  // Verifica que el sistema permite duplicados (bug)
  verificarHabitacionDuplicada() {
    // Después de crear la duplicada, la página vuelve a la lista de habitaciones
    cy.url().should('include', '/admin/rooms');
    
    // Verificamos que no aparece el mensaje de error "Failed to create room"
    // (que sí aparece cuando faltan campos, pero no cuando se duplica)
    cy.contains('Failed to create room').should('not.exist');
  }

  // Navegar a la sección de Branding
  irABranding() {
    cy.get('#brandingLink').click();
    cy.url().should('include', '/admin/branding');
  }

  // Intentar cambiar el teléfono en Branding
  cambiarTelefono(nuevoTelefono) {
    cy.get('#contactPhone').clear().type(nuevoTelefono);
    cy.get('#updateBranding').click();
  }

  // Verificar el mensaje de error (bug)
  verificarErrorBranding() {
    cy.contains('Url should be a correct url format').should('be.visible');
    // Verificamos que seguimos en la página de branding (el cambio no se guardó)
    cy.url().should('include', '/admin/branding');
  }

  // Navegar a la sección de Mensajes
  irAMensajes() {
    cy.get(':nth-child(4) > .nav-link').click();
    cy.url().should('include', '/admin/message');
  }

  // Abrir el primer mensaje
  abrirPrimerMensaje() {
    // El contenedor del mensaje tiene data-testid="message0"
    cy.get('[data-testid="message0"]').first().click();
    
    // Verificamos que se abrió el detalle con el botón "Close"
    cy.get('.col-12 > .btn').should('be.visible');
  }

  // Verificar que NO existe el botón Reply (bug)
  verificarFaltaBotonResponder() {
    // Buscamos el botón "Reply" y verificamos que no existe
    cy.contains('button', 'Reply').should('not.exist');
  }

  // Hacer clic en Login sin llenar campos
  hacerClickLoginVacio() {
    this.elements.loginBtn().click();
  }

  // Verificar mensaje de error por campos vacíos
  verificarErrorLoginVacio() {
    cy.contains('Invalid credentials').should('be.visible');
    // También verificamos que seguimos en la página de login
    cy.url().should('include', '/admin');
  }

  // Navegar a la sección de Report
  irAReport() {
    // Intentamos con el texto "Report" en la barra de navegación
    cy.contains('a', 'Report').click();
    cy.url().should('include', '/admin/report');
  }

    // Intentar acceder a una URL protegida sin loguearse
  visitarAdminSinLogin() {
    cy.visit('/admin/rooms');
  }

  // Verificar que fuimos redirigidos al login
  verificarRedireccionAlLogin() {
    // Deberíamos estar en la URL de login
    cy.url().should('include', '/admin');
    // El botón de login debe estar visible
    this.elements.loginBtn().should('be.visible');
  }

}

export default new AdminPage();