const path = require("path");

exports.createPages = async (gatsbyUtilities) => {
  const {
    actions: { createRedirect, createPage },
    graphql,
  } = gatsbyUtilities;

  const result = await graphql(`
    query fakerQuery {
      allNameData {
        nodes {
          lorem {
            paragraphs
            slug
            words
          }
          name {
            lastName
            firstName
          }
        }
      }
    }
  `);

  const fakerPostTemplate = path.resolve(`src/templates/fakerPost.js`);
  const fakerPostArchive = path.resolve(`src/templates/fakerArchive.js`);

  createPage({
    path: `/faker/`,
    component: fakerPostArchive,
    defer: true,
    context: {
      posts: result.data.allNameData.nodes,
    },
  });

  result.data.allNameData.nodes.forEach((node) => {
    createPage({
      path: `/faker/${node.lorem.slug}`,
      component: fakerPostTemplate,
      defer: true,
      context: {
        slug: node.lorem.slug,
      },
    });
  });

  for (let i = 1; i <= 10; i++) {
    createPage({
      path: `/generated/page-${i}`,
      component: require.resolve(`./src/templates/example.js`),
      defer: i <= 5 ? false : true,
      context: {
        pageNumber: i,
      },
    });
  }

  createRedirect({
    fromPath: "/perm-redirect",
    toPath: "/posts/page-1",
    isPermanent: true,
  });
  createRedirect({
    fromPath: "/temp-redirect",
    toPath: "/posts/page-2",
    isPermanent: false,
  });
  createRedirect({
    fromPath: "/alt-redirect",
    toPath: "/posts/page-3",
    statusCode: 307,
  });

  createRedirect({
    fromPath: "/example-proxy",
    toPath: "http://example.com",
    statusCode: 200,
  });
};
