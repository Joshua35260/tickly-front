describe('LoginComponent', () => {
  it('should connect and redirect to dashboard', () => {
    // Intercept the sign-in API call
    cy.intercept('POST', 'http://localhost:3000/api/auth/signin', {
      statusCode: 200,
      body: {
        // Mock response for a successful sign-in
        cookie: 'Tickly',
      },
    }).as('signinRequest');

    // Intercept the session check
    cy.intercept('GET', 'http://localhost:3000/api/auth/session', {
      statusCode: 200,  // Ensure this returns 200 if login is successful
      body: {
        user: {
          email: 'joshuadupin@topics.fr',
        },
      },
    }).as('sessionCheck');

    // 1. Visiter la page de connexion
    cy.visit('/auth'); // Assurez-vous que l'URL est correcte

    // 2. Remplir le formulaire avec les identifiants
    cy.get('[data-cy=login]').type('joshuadupin@topics.fr'); // Saisir le nom d'utilisateur
    
    cy.get('[data-cy=password]').type('test'); // Saisir le mot de passe

    // 3. Soumettre le formulaire
    cy.get('[data-cy=submit]').click(); 

    // 5. Attendre la vérification de la session
    cy.wait('@sessionCheck').its('response.statusCode').should('eq', 200);

    // 6. Vérifier la redirection
    cy.url().should('include', '/');

  });
});
