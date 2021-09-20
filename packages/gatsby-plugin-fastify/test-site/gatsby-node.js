exports.createPages = async (gatsbyUtilities) => {
  const {
    actions: { createRedirect, createPage },
  } = gatsbyUtilities;

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
};
