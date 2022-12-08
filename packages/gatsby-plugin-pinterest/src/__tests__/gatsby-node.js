import { testPluginOptionsSchema } from "gatsby-plugin-utils";

import { pluginOptionsSchema } from "../gatsby-node";

test.each`
  saveButton                                                                 | expectedErrors
  ${"This should be a boolean or an object"}                                 | ${['"saveButton" must be one of [boolean, object]']}
  ${{ round: "This should be a boolean", tall: "This should be a boolean" }} | ${['"saveButton" does not match any of the allowed types']}
  ${{ round: "This should be a boolean", tall: true }}                       | ${['"saveButton.round" must be a boolean']}
  ${{ round: true, tall: "This should be a boolean" }}                       | ${['"saveButton.tall" must be a boolean']}
`(
  "should provide meaningful errors when fields are invalid: $saveButton",
  async ({ expectedErrors, saveButton }) => {
    const { errors, isValid } = await testPluginOptionsSchema(pluginOptionsSchema, { saveButton });

    expect(errors).toEqual(expectedErrors);
    expect(isValid).toBe(false);
  }
);

test("should provide meaningful errors when fields are deprecated", async () => {
  const expectedErrors = [
    "'round' is no longer supported. Use 'saveButton.round' instead by setting it to the same value you had before on 'round'.",
    "'tall' is no longer supported. Use 'saveButton.tall' instead by setting it to the same value you had before on 'tall'.",
  ];

  const { errors, isValid } = await testPluginOptionsSchema(pluginOptionsSchema, {
    round: true,
    tall: true,
  });

  expect(errors).toEqual(expectedErrors);
  expect(isValid).toBe(false);
});

test.each`
  saveButton
  ${undefined}
  ${true}
  ${false}
  ${{}}
  ${{ round: true }}
  ${{ round: false }}
  ${{ tall: true }}
  ${{ tall: false }}
  ${{ round: true, tall: true }}
`("should validate the schema: $saveButton", async ({ saveButton }) => {
  const { errors, isValid } = await testPluginOptionsSchema(pluginOptionsSchema, { saveButton });

  expect(errors).toEqual([]);
  expect(isValid).toBe(true);
});
