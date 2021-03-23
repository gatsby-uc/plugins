import { search as searchPackagist } from 'packagist-api-client';
import { createRemoteFileNode } from "gatsby-source-filesystem";
import { Octokit } from "@octokit/rest";

export async function sourceNodes(
  { actions, createNodeId, createContentDigest, reporter },
  { query, githubApi } // plugin-options
) {
  if (!query || !(query.name || query.type || query.tags)) {
    reporter.error('No query paramaters passed to packagist api', query);
  } else {
    try {
      const { results: packages, total } = await getAllSearchResults(async () =>
        searchPackagist(query)
      );

      reporter.info(`Got results for ${total} Packagist packages!`);

      for (const pkg of packages) {
        actions.createNode({
          ...pkg,
          id: createNodeId(pkg.name),
          internal: {
            type: 'packagistPackage',
            contentDigest: createContentDigest(pkg),
            content: JSON.stringify(pkg),
          },
        });
      }
    } catch (e) {
      if (e.response) {
        reporter.error('Error searching for packages: ', e);
      }
      console.error(e)
      reporter.panic('unkown error');
    }
  }
};

export async function createResolvers({ actions, createResolvers, createNodeId, createContentDigest, reporter, store, cache }, { githubApi }) {
  global.reporter = reporter;
  const { createNode } = actions;

  const README_DOMAINS = {};

  if (githubApi) {
    const octokit = new Octokit(githubApi);

    README_DOMAINS['github.com'] = async (path) => {
      const lastSlash = path.lastIndexOf('/')
      const repo = {
        owner: path.substring(path.indexOf('/') + 1, lastSlash),
        repo: path.substring(lastSlash + 1)
      }

      try {
        const { data: { download_url: url }
        } = await octokit.repos.getReadme(repo)

        return url;
      } catch (e) {
        if (e.status === 403) {
          const errorText = `Github: ${e}`
          reporter.panicOnBuild(errorText)
        } else {
          reporter.warn('Error Fetching Readme from Github', e)
        }
      }
    }
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

              const url = await README_DOMAINS[hostname](pathname)

              return createRemoteFileNode({
                url,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
              })
            } catch (e) {
              reporter.error('Well that was unexpected', e);
            }
          } else {
            reporter.warn(
              `Package "${name}" isn't hosted on Github, unable to fetch Readme for non-github repos yet (PRs welcome).`
            );
          }

        }
      }
    }
  })
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


