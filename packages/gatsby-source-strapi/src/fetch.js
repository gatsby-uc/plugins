import { castArray, flattenDeep } from "lodash";
import qs from "qs";
import { cleanData } from "./clean-data";

export const fetchStrapiContentTypes = async (axiosInstance) => {
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

const convertQueryParameters = (queryParameters, version = 5) => {
  if (version === 4) {
    return queryParameters;
  }
  // assume v5.
  // rewrite v4 publicationState=preview to status=draft
  // https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/publication-state-removed
  const { publicationState, ...rest } = queryParameters;
  if (publicationState !== "preview") {
    return queryParameters;
  }
  return {
    ...rest,
    status: "draft",
  };
};

export const fetchEntity = async (
  { endpoint, queryParams, uid, pluginOptions, version = 5 },
  context,
) => {
  const { reporter, axiosInstance } = context;

  /** @type AxiosRequestConfig */
  const options = {
    method: "GET",
    url: endpoint,
    params: convertQueryParameters(queryParams, version),
    // Source: https://github.com/axios/axios/issues/5058#issuecomment-1379970592
    paramsSerializer: {
      serialize: (parameters) => qs.stringify(parameters, { encodeValuesOnly: true }),
    },
  };

  try {
    reporter.info(
      `Starting to fetch data from Strapi - ${
        options.url
      } with ${options.paramsSerializer.serialize(options.params)}`,
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
        for (const localization of response.data.localizations) {
          otherLocales.push(localization.locale);
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
      cleanData(entry, { ...context, contentTypeUid: uid }, version),
    );
  } catch (error) {
    if (error.response.status !== 404) {
      reporter.panic(
        `Failed to fetch data from Strapi ${options.url} with ${JSON.stringify(options)}`,
        error,
      );
    }
    return [];
  }
};

export const fetchEntities = async (
  { endpoint, queryParams, uid, pluginOptions, version = 5 },
  context,
) => {
  const { reporter, axiosInstance } = context;

  /** @type AxiosRequestConfig */
  const options = {
    method: "GET",
    url: endpoint,
    params: convertQueryParameters(queryParams, version),
    paramsSerializer: {
      serialize: (parameters) => qs.stringify(parameters, { encodeValuesOnly: true }),
    },
  };

  // Handle internationalization
  const locale = pluginOptions?.i18n?.locale;
  const localesToFetch = [];

  if (locale) {
    delete queryParams.locale;

    if (locale === "all") {
      // Get all available locales from first entity
      const { data: previewResponse } = await axiosInstance({
        ...options,
        params: {
          ...options.params,
          pagination: { pageSize: 1 },
          populate: {
            localizations: {
              fields: ["locale"],
            },
          },
        },
      });

      // Add default locale from first entry
      if (previewResponse.data?.[0]) {
        const firstEntry = previewResponse.data[0];
        const localesSet = new Set();

        // Add current entry's locale
        if (firstEntry.locale) {
          localesSet.add(firstEntry.locale);
        }

        // Add other locales from localizations array or data property
        const localizations = firstEntry.localizations?.data || firstEntry.localizations || [];
        for (const localization of localizations) {
          const localeValue = localization.locale || localization.attributes?.locale;
          if (localeValue) {
            localesSet.add(localeValue);
          }
        }

        localesToFetch.push(...localesSet);
      }
    } else {
      // Only one locale
      localesToFetch.push(locale);
    }
  } else {
    // No locale specified, fetch default
    localesToFetch.push(undefined);
  }

  try {
    // Fetch data for each locale
    const allLocalesData = [];

    for (const currentLocale of localesToFetch) {
      const localeOptions = {
        ...options,
        params: {
          ...options.params,
          ...(currentLocale && { locale: currentLocale }),
        },
      };

      const { data: response } = await axiosInstance(localeOptions);

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
            ...localeOptions,
            params: {
              ...localeOptions.params,
              pagination: {
                ...localeOptions.params.pagination,
                page,
              },
            },
          };

          reporter.info(
            `Starting to fetch page ${page} from Strapi - ${
              fetchOptions.url
            } with ${options.paramsSerializer.serialize(fetchOptions.params)}`,
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
      allLocalesData.push(...data, ...flattenDeep(results));
    }

    const cleanedData = allLocalesData.map((entry) =>
      cleanData(entry, { ...context, contentTypeUid: uid }, version),
    );

    return cleanedData;
  } catch (error) {
    reporter.panic(`Failed to fetch data from Strapi ${options.url}`, error);
    return [];
  }
};
