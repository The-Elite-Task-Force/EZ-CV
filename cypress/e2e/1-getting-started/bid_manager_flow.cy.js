describe("Bid Manger flow", () => {
  it("should log in and go through a bid manager flow (Polish this title later)", () => {
    // cy.visit("http://localhost:5173/auth/login");
    cy.visit("http://localhost:5173/auth/register");
    // cy.login("test@test.com", "test@test.com");
    const randomNumber = Math.floor(Math.random() * 10000) + 1;

    // This is not an elegant solution, but it gets the job done for now.
    const credentials = {
      name: `name${randomNumber}`,
      username: `user${randomNumber}`,
      email: `user${randomNumber}@example.com`,
      password: `password${randomNumber}`,
    };

    cy.createAccount(credentials);
    cy.get('[data-cy="go-to-dashboard"]').click();

    cy.url().should("include", "/dashboard/resumes");
    cy.contains("Resumes");

    cy.contains("Companies").click();
    cy.contains("Create a new company").click();
    cy.get('input[name="name"]').type(`Company Inc. ${randomNumber}`);
    cy.get('button[type="submit"]').click();

    cy.contains("Resumes").click();
    cy.contains("Create a new resume").click();
    cy.get('input[name="title"]').type("Test CV: " + randomNumber);
    cy.get('button[type="submit"]').click();
    cy.contains("Test CV: " + randomNumber).click({ force: true });
    cy.contains("Set as profile").click({ force: true });

    cy.contains("Projects").click({ force: true });
    cy.contains("Create a new project").click({ force: true });
    cy.get('input[name="name"]').type("Test Project: " + randomNumber);
    cy.get('[data-cy="CreateProjectButton"]').click({ force: true });
    cy.contains("Test Project: " + randomNumber).dblclick({ force: true });

    cy.contains("Manage Project").click({ force: true });

    cy.get('[data-cy="add-user-button"]').then(($buttons) => {
      const limitedButtons = $buttons.toArray().slice(0, 1);

      limitedButtons.forEach((button) => {
        cy.wrap(button).click({ force: true });
      });
    });

    cy.contains("Projects").click({ force: true });
    cy.contains("Test Project: " + randomNumber).dblclick({ force: true });

    cy.contains("Select resume").click({ force: true });
    cy.get('[role="option"]').first().click({ force: true });

    cy.logoutFromDashboard();
    cy.contains("Sign in to your account");
  });
});
