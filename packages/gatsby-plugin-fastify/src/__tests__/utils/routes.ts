/**
 * # Fastify Routing Styles
 * https://github.com/delvedor/find-my-way
 *
 * ## Match order
 *  - static
 *  - parametric
 *  - wildcards
 *  - parametric(regex)
 *  - multi parametric(regex)
 *
 * ## Parametric Routing
 * - '/example/:userId'
 * - '/example/:userId/:secretToken'
 * - '/example/:file(^\\d+).png'
 * - '/example/near/:lat-:lng/radius/:r'
 * - '/example/at/:hour(^\\d{2})h:minute(^\\d{2})m'
 * - fastify.post('/name::verb') // will be interpreted as /name:verb
 *
 * ## Wildcard
 * - '/example/*'
 * - '/example/test/*'
 *
 * # Gatsby Routing Styles
 * https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/
 * https://www.gatsbyjs.com/docs/how-to/routing/client-only-routes-and-user-authentication/#self-hosting-with-nginx-and-apache
 * https://www.gatsbyjs.com/docs/reference/functions/routing/
 *
 * ## Dynamic segments
 * - /users/[id].js == /users/:id
 * -
 *
 * ## Splat routes (wildcards)
 * - /image/[...myKeyName].js == /image/*myKeyName (myKeyName is used in params of gatsby instead of *)
 * - /image/[...].js == /image/*
 */

import { formatMatchPath } from "../../utils/routes";

describe("Gatsby Route Handler Tests", () => {
  describe("Match path formatter Tests", () => {
    it("Correctly handle splat route modification to ignore final /", () => {
      const result = formatMatchPath("/test/*");
      expect(result).toBe("/test*");
    });

    it("Correctly handle dynamic/parametric route modification from [] to :", () => {
      const result = formatMatchPath("/test/[id]");
      expect(result).toBe("/test/:id");
    });

    it("Correctly handle dynamic/parametric route modification from [] to : with : in url", () => {
      const result = formatMatchPath("/test/user:[id]");
      expect(result).toBe("/test/user::id");
    });

    it("Correctly handle dynamic/parametric route modification from [] to : with caps", () => {
      const result = formatMatchPath("/test/[ID]");
      expect(result).toBe("/test/:ID");
    });

    it("Correctly handle multiple dynamic/parametric route modification from [] to :", () => {
      const result = formatMatchPath("/[uri]/[id]");
      expect(result).toBe("/:uri/:id");
    });

    it("Correctly handle splat/wildcard route modification from [...] to *", () => {
      const result = formatMatchPath("/test/[...]");
      expect(result).toBe("/test*");
    });

    it("Correctly handle named splat/wildcard route modification to ignore final [...apiRoute] to *", () => {
      const result = formatMatchPath("/test/[...apiRoute]");
      expect(result).toBe("/test*");
    });
  });
});
