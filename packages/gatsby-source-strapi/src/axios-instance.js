import axios from "axios";

/**
 * Inspiration from:
 * https://gist.github.com/matthewsuan/2bdc9e7f459d5b073d58d1ebc0613169
 *
 * @param {AxiosInstance} axiosInstance
 * @param {number} maxParallelRequests
 */
const throttlingInterceptors = (axiosInstance, maxParallelRequests) => {
  const INTERVAL_MS = 50; // Wait time until retrying request
  let PENDING_REQUESTS = 0;

  /** Axios Request Interceptor */
  axiosInstance.interceptors.request.use(function (config) {
    return new Promise((resolve, _) => {
      let interval = setInterval(() => {
        if (PENDING_REQUESTS < maxParallelRequests) {
          PENDING_REQUESTS++;
          clearInterval(interval);
          resolve(config);
        }
      }, INTERVAL_MS);
    });
  });

  /** Axios Response Interceptor */
  axiosInstance.interceptors.response.use(
    function (response) {
      PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
      return Promise.resolve(response);
    },
    function (error) {
      PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
      return Promise.reject(error);
    }
  );
};

/**
 *
 * @param {Object} strapiConfig - Strapi configuration object
 * @param {string} strapiConfig.apiURL - Strapi API endpoint
 * @param {Object|undefined} strapiConfig.headers - Headers to be sent with each request
 * @param {number|undefined} strapiConfig.maxParallelRequests - Number of parallel requests
 * @param {string} strapiConfig.accessToken - Strapi access token
 * @returns {AxiosInstance}
 */
export const createAxiosInstance = (strapiConfig) => {
  const {
    maxParallelRequests = Number.POSITIVE_INFINITY,
    headers = {},
    accessToken,
    apiURL,
  } = strapiConfig;

  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  const instance = axios.create({
    baseURL: apiURL,
    headers,
  });

  /** Add throttling interceptors */
  throttlingInterceptors(instance, maxParallelRequests);

  return instance;
};
