Cypress.Commands.add("login", (username, password) => {
  cy.get('input[name="identifier"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("createAccount", ({ name, username, email, password }) => {
  cy.get('input[name="name"]').type(name);
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("button").contains("Sign up").click();
});

Cypress.Commands.add("logoutFromDashboard", () => {
  cy.get('[data-cy="user-menu-button"]').click({ force: true });
  cy.get('[data-cy="logout-button"]').click({ force: true });
  cy.get('button[type="submit"]').click({ force: true });
});
