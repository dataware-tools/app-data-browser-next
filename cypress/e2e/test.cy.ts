describe("empty spec", () => {
  it("passes", () => {
    cy.loginByAuth0Api();
    cy.visit("localhost:3000");
    // if (localStorage.getItem("loggedin") !== "true") {
    //   cy.contains("Login").click();
    //   cy.get("#username").type(Cypress.env("auth0Username"));
    //   cy.get("#password").type(`${Cypress.env("auth0Password")}{enter}`);
    //   window.localStorage.setItem("loggedin", "true");
    // }
    cy.contains("Scene caption").click();
    cy.contains("Sample").click();
    cy.contains("Files").click();
    cy.contains("sample.bag").click();
    cy.contains("Preview").click();
    cy.contains("webviz with rosbridge").click();
    cy.contains("Select job template").next().next().click();
    cy.contains("ROS Provider with scene-caption").click();
    cy.wait(300);
    cy.get("button").contains("Submit").click();
    cy.contains("Execute").click();
    // ! I don't know how to test multiple tabs that is opened by javascript not <a/> on cypress
  });
});
