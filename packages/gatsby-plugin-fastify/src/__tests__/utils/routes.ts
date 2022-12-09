import { TrailingSlash } from "gatsby-page-utils";
import { formatMatchPath } from "../../utils/routes";

describe("Gatsby Route Handler Tests", () => {
  describe("Match path formatter Tests", () => {
    it.each(["always", "never", "ignore"])(`Always happens: "$s"`, (trailingSlash) => {
      expect(formatMatchPath("/test/*name", trailingSlash as TrailingSlash)).not.toContain("name");
    });

    describe("trailingSlash = 'always'", () => {
      const trailingSlash = "always";

      it.each([
        ["/test/:stuff", "/test/:stuff/"],
        ["/:test/:two", "/:test/:two/"],
      ])("Correctly modify match path from %s to %s", (input, output) => {
        expect(formatMatchPath(input, trailingSlash)).toBe(output);
      });

      it.each(["/test/*", "/test/:test/", "/test/:two/stuff/", "/test/:two/*"])(
        "Don't modify match path route: %s",
        (input) => {
          expect(formatMatchPath(input, trailingSlash)).toBe(input);
        }
      );
    });

    describe("trailingSlash = 'ignore'", () => {
      const trailingSlash = "ignore";

      it.each([["/test/*", "/test*"]])(
        "Correctly modify match path from %s to %s",
        (input, output) => {
          expect(formatMatchPath(input, trailingSlash)).toBe(output);
        }
      );

      it.each(["/test/:stuff", "/test/:two/*"])("Don't modify match path route: %s", (input) => {
        expect(formatMatchPath(input, trailingSlash)).toBe(input);
      });
    });
  });

  describe("trailingSlash = 'never'", () => {
    const trailingSlash = "never";
    it.each([["/test/*", "/test*"]])(
      "Correctly modify match path from %s to %s",
      (input, output) => {
        expect(formatMatchPath(input, trailingSlash)).toBe(output);
      }
    );

    it.each(["/test/:stuff", "/test/:two/*"])("Don't modify match path route: %s", (input) => {
      expect(formatMatchPath(input, trailingSlash)).toBe(input);
    });
  });
});
