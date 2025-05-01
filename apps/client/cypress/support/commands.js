Cypress.Commands.add("login", (username, password) => {
  cy.get('input[name="identifier"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("logoutFromDashboard", () => {
  cy.get('[data-cy="user-menu-button"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.get('button[type="submit"]').click();
});
