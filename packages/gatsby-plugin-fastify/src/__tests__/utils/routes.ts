import { formatMatchPath } from "../../utils/routes";

describe("Gatsby Route Handler Tests", () => {
  describe("Match path formatter Tests", () => {
    it.each([
      ["/test/*", "/test*"],
      ["/test/*name", "/test*"],
    ])("Correctly modify match path from %s to %s", (input, output) => {
      expect(formatMatchPath(input)).toBe(output);
    });

    it.each(["/test/:test"])("Don't modify match path route: %s", (input) => {
      expect(formatMatchPath(input)).toBe(input);
    });
  });
});
