import { castArray, flattenDeep } from "lodash";
import createInstance from "./axios-instance";
import qs from "qs";
import { cleanData } from "./clean-data";

export const fetchStrapiContentTypes = async (strapiConfig) => {
  const axiosInstance = createInstance(strapiConfig);
  const [
    {
      data: { data: contentTypes },
    },
    {
      data: { data: components },
    },
  ] = await Promise.all([
    axiosInstance.get("/api/content-type-builder/content-types"),
    axiosInstance.get("/api/content-type-builder/components"),
  ]);

  return {
    schemas: [...contentTypes, ...components],
    contentTypes,
    components,
  };
};

export const fetchEntity = async ({ endpoint, queryParams, uid, pluginOptions }, context) => {
  const { strapiConfig, reporter } = context;
  const axiosInstance = createInstance(strapiConfig);

  const options = {
    method: "GET",
    url: endpoint,
    params: queryParams,
    paramsSerializer: (parameters) => qs.stringify(parameters, { encodeValuesOnly: true }),
  };

  try {
    reporter.info(
      `Starting to fetch data from Strapi - ${options.url} with ${JSON.stringify(options)}`
    );

    // Handle internationalization
    const locale = pluginOptions?.i18n?.locale;
    const otherLocales = [];

    if (locale) {
      // Ignore queryParams locale in favor of pluginOptions
      delete queryParams.locale;

      if (locale === "all") {
        // Get all available locales
        const { data: response } = await axiosInstance({
          ...options,
          params: {
            populate: {
              localizations: {
                fields: ["locale"],
              },
            },
          },
        });
        for (const localization of response.data.attributes.localizations.data) {
          otherLocales.push(localization.attributes.locale);
        }
      } else {
        // Only one locale
        queryParams.locale = locale;
      }
    }

    // Fetch default entity based on request options
    const { data } = await axiosInstance(options);

    // Fetch other localizations of this entry if there are any
    const otherLocalizationsPromises = otherLocales.map(async (locale) => {
      const { data: localizationResponse } = await axiosInstance({
        ...options,
        params: {
          ...options.params,
          locale,
        },
      });
      return localizationResponse.data;
    });

    // Run queries in parallel
    const otherLocalizationsData = await Promise.all(otherLocalizationsPromises);

    return castArray([data.data, ...otherLocalizationsData]).map((entry) =>
      cleanData(entry, { ...context, contentTypeUid: uid })
    );
  } catch {
    // reporter.panic(
    //   `Failed to fetch data from Strapi ${opts.url} with ${JSON.stringify(opts)}`,
    //   error,
    // );
    return [];
  }
};

export const fetchEntities = async ({ endpoint, queryParams, uid, pluginOptions }, context) => {
  const { strapiConfig, reporter } = context;
  const axiosInstance = createInstance(strapiConfig);

  const options = {
    method: "GET",
    url: endpoint,
    params: queryParams,
    paramsSerializer: (parameters) => qs.stringify(parameters, { encodeValuesOnly: true }),
  };

  // Use locale from pluginOptions if it's defined
  if (pluginOptions?.i18n?.locale) {
    delete queryParams.locale;
    queryParams.locale = pluginOptions.i18n.locale;
  }

  try {
    reporter.info(
      `Starting to fetch data from Strapi - ${options.url} with ${JSON.stringify(options.params)}`
    );

    const { data: response } = await axiosInstance(options);

    const data = response?.data || response;
    const meta = response?.meta;

    const page = Number.parseInt(meta?.pagination.page || 1, 10);
    const pageCount = Number.parseInt(meta?.pagination.pageCount || 1, 10);

    const pagesToGet = Array.from({
      length: pageCount - page,
    }).map((_, index) => index + page + 1);

    const fetchPagesPromises = pagesToGet.map((page) => {
      return (async () => {
        const fetchOptions = {
          ...options,
        };

        fetchOptions.params.pagination.page = page;

        reporter.info(
          `Starting to fetch data from Strapi - ${fetchOptions.url} with ${JSON.stringify(
            options.paramsSerializer(options.params)
          )}`
        );

        try {
          const {
            data: { data },
          } = await axiosInstance(fetchOptions);

          return data;
        } catch (error) {
          reporter.panic(`Failed to fetch data from Strapi ${fetchOptions.url}`, error);
        }
      })();
    });

    const results = await Promise.all(fetchPagesPromises);

    const cleanedData = [...data, ...flattenDeep(results)].map((entry) =>
      cleanData(entry, { ...context, contentTypeUid: uid })
    );

    return cleanedData;
  } catch (error) {
    reporter.panic(`Failed to fetch data from Strapi ${options.url}`, error);
    return [];
  }
};
