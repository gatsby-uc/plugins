import { formatMatchPath } from "../../utils/routes";

describe("Gatsby Route Handler Tests", () => {
  describe("Match path formatter Tests", () => {
    it("Correctly handle splat route modification to ignore final /", () => {
      const result = formatMatchPath("/test/*");
      expect(result).toBe("/test*");
    });

    it("Correctly handle named splat/wildcard route modification to ignore final *name to *", () => {
      const result = formatMatchPath("/test/*nameu");
      expect(result).toBe("/test*");
    });
  });
});
