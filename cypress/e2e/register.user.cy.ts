/// <reference types="cypress" />

describe('Registro de nuevo usuario', () => {
  beforeEach(() => {
    // Visita la página de registro
    cy.visit('http://localhost:4200/register');
    cy.wait(2000); 
    cy.get('body').then(($body) => {
      cy.log('HTML actual:', $body.html());
    });
  });

  it('Debería registrar un usuario y recibir un token', () => {

    cy.get('form', { timeout: 10000 }).should('exist'); // espera hasta que cargue el form

    // Completar el formulario de registro
    cy.get('input[formcontrolname="name"]').type('Nuevo Usuario');
    cy.get('input[formcontrolname="email"]').type('nuevo@test.com');
    cy.get('input[formcontrolname="password"]').type('123456');
    cy.get('input[formcontrolname="confirmPassword"]').type('123456');
    
    // Interceptar la petición HTTP al backend
    cy.intercept('POST', 'http://localhost:3001/users/register').as('registerRequest');
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click();
    
    // Esperar la respuesta del backend
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response, 'Debe existir una respuesta del backend').to.not.be.undefined;
    
        // Aseguramos el tipo antes de usarlo
      if (!interception.response) return;
    
      const { response } = interception;
    
      expect(response.statusCode).to.eq(201);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string');
      expect(response.body.user.email).to.eq('nuevo@test.com');
    });
    
    // Verificar que la app redirige o muestra el mensaje esperado
    cy.url().should('include', '/dashboard'); // o donde sea que se redirija
 });
})

 
