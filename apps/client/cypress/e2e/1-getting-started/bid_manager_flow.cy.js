describe("Bid Manger flow", () => {
  it("should log in and go through a bid manager flow (Polish this title later)", () => {
    cy.visit("/auth/login");
    cy.login("test@test.com", "test@test.com");
    cy.url().should("include", "/dashboard/resumes");
    cy.contains("Resumes");

    cy.logoutFromDashboard();
    cy.url().should("include", "/");
    cy.contains("Sign in to your account");
  });
});
