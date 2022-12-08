import { formatMatchPath } from "../../utils/routes";

describe("Gatsby Route Handler Tests", () => {
  describe("Match path formatter Tests", () => {
    describe("trailingSlash = 'always'", () => {
      const trailingSlash = "always";
      it("Correctly handle splat route modification to ignore final /", () => {
        const result = formatMatchPath("/test/*", trailingSlash);
        expect(result).toBe("/test/*");
      });

      it("Correctly handle named splat/wildcard route modification to ignore final *name to *", () => {
        const result = formatMatchPath("/test/*name", trailingSlash);
        expect(result).toBe("/test/*");
      });
    });
    describe("trailingSlash = 'ignore'", () => {
      const trailingSlash = "ignore";
      it("Correctly handle splat route modification to ignore final /", () => {
        const result = formatMatchPath("/test/*", trailingSlash);
        expect(result).toBe("/test*");
      });

      it("Correctly handle named splat/wildcard route modification to ignore final *name to *", () => {
        const result = formatMatchPath("/test/*name", trailingSlash);
        expect(result).toBe("/test*");
      });
    });
    describe("trailingSlash = 'never'", () => {
      const trailingSlash = "never";
      it("Correctly handle splat route modification to ignore final /", () => {
        const result = formatMatchPath("/test/*", trailingSlash);
        expect(result).toBe("/test*");
      });

      it("Correctly handle named splat/wildcard route modification to ignore final *name to *", () => {
        const result = formatMatchPath("/test/*name", trailingSlash);
        expect(result).toBe("/test*");
      });
    });
  });
});
