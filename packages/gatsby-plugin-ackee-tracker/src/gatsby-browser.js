import * as ackeeTracker from "ackee-tracker";

/**
 * Hold the tracker instance. Persists after the client is hydrated,
 * so is destroyed when any page is re-fetched from the server.
 */
let trackerInstance;

/**
 * Record a page visit when it is visited.
 *
 * @param {*} _ - unused object with parameters `location` and `prevLocation`.
 * @param {*} pluginOptions - contains all options as defined by the config.
 */
export const onRouteUpdate = (
  _,
  { domainId, server, ignoreLocalhost, ignoreOwnVisits, detailed }
) => {
  /**
   * If there is no tracker instance, instantiate one with the plugin options.
   */
  if (trackerInstance == undefined) {
    trackerInstance = ackeeTracker.create(server, {
      ignoreLocalhost,
      ignoreOwnVisits,
      detailed,
    });
  }

  /**
   * Record the visit to this route.
   */
  trackerInstance.record(domainId);
};
