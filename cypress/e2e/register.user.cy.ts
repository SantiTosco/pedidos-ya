/// <reference types="cypress" />

describe('Registro de nuevo usuario', () => {
    afterEach(() => {
      // Limpiar usuario creado después del test
      cy.request('DELETE', 'http://localhost:3001/user/nuevo@test.com');
    });
  beforeEach(() => {
    // Limpiar usuario específico
    //cy.request('DELETE', 'http://localhost:3001/user/nuevo@test.com');
    // Visita la página de registro
    cy.visit('http://localhost:4200/register');
    cy.wait(2000); 
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

      console.log(interception.response);
        // Aseguramos el tipo antes de usarlo
      if (!interception.response) return;
    
      const { response } = interception;
    
      expect(response).to.exist;
      expect(response.body).to.have.property('accessToken');
      expect(response.body.accessToken).to.be.a('string');
      expect(response.body.user.email).to.eq('nuevo@test.com');
    });
    
    // Verificar que la app redirige o muestra el mensaje esperado
    cy.url().should('include', '/dashboard'); // o donde sea que se redirija

});
});