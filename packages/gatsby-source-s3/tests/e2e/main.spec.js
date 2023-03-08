describe("e2e", () => {
  it("should source images from S3", () => {
    cy.visit("http://localhost:9000");

    cy.get("img").should("exist");
  });

  it("should contain all images", () => {
    cy.visit("http://localhost:9000");

    cy.get(".images-grid").find(".s3-image").should("have.length", 1502);
  });
});
