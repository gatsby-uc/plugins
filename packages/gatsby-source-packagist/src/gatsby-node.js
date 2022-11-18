import { search as searchPackagist } from "packagist-api-client";
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { Octokit } from "@octokit/rest";

export async function sourceNodes(
  { actions, createNodeId, createContentDigest, reporter },
  { query }
) {
  if (!query || !(query.name || query.type || query.tags)) {
    reporter.error("No query paramaters passed to packagist api", query);
  } else {
    try {
      const { results: packages, total } = await getAllSearchResults(async () =>
        searchPackagist(query)
      );

      reporter.info(`Got results for ${total} Packagist packages!`);

      for (const package_ of packages) {
        actions.createNode({
          ...package_,
          id: createNodeId(package_.name),
          internal: {
            type: "packagistPackage",
            contentDigest: createContentDigest(package_),
            content: JSON.stringify(package_),
          },
        });
      }
    } catch (error) {
      if (error.response) {
        reporter.error("Error searching for packages: ", error);
      }
      reporter.panic("unknown error", error);
    }
  }
}

export async function createResolvers(
  { actions, createResolvers, createNodeId, reporter, store, cache },
  { githubApi }
) {
  global.reporter = reporter;
  const { createNode } = actions;

  const README_DOMAINS = {};

  if (githubApi) {
    const octokit = new Octokit(githubApi);

    README_DOMAINS["github.com"] = async (path) => {
      const lastSlash = path.lastIndexOf("/");
      const repo = {
        owner: path.slice(path.indexOf("/") + 1, lastSlash),
        repo: path.slice(Math.max(0, lastSlash + 1)),
      };

      try {
        const {
          data: { download_url: url },
        } = await octokit.repos.getReadme(repo);

        return url;
      } catch (error) {
        if (error.status === 403) {
          const errorText = `Github: ${error}`;
          reporter.panicOnBuild(errorText);
        } else {
          reporter.warn("Error Fetching Readme from Github", error);
        }
      }
    };
  }

  createResolvers({
    packagistPackage: {
      readmeFile: {
        type: "File",
        async resolve(source) {
          const { repository, name } = source;

          const { hostname, pathname } = new URL(repository);

          if (README_DOMAINS.hasOwnProperty(hostname)) {
            try {
              reporter.verbose(`Getting readme for package: ${name}`);

              const url = await README_DOMAINS[hostname](pathname);

              return createRemoteFileNode({
                url,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              });
            } catch (error) {
              reporter.error("Well that was unexpected", error);
            }
          } else {
            reporter.warn(
              `Package "${name}" isn't hosted on Github, unable to fetch Readme for non-github repos yet (PRs welcome).`
            );
          }
        },
      },
    },
  });
}

async function getAllSearchResults(fetchResults, allResults = []) {
  const { results: pageResults, total, next } = await fetchResults();

  allResults.push(pageResults);

  if (!next) {
    const results = allResults.flat();
    return { results, total };
  }

  return getAllSearchResults(next, allResults);
}
