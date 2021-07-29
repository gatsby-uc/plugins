exports.createPages = async (gatsbyUtilities) => {
  const {
    actions: { createRedirect },
  } = gatsbyUtilities;
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
