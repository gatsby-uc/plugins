export const pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    domainId: Joi.string().guid({ version: "uuidv4" }).required(),
    server: Joi.string().uri().required(),
    ignoreLocalhost: Joi.boolean().default(true),
    ignoreOwnVisits: Joi.boolean().default(false),
    detailed: Joi.boolean().default(false),
  });
};
