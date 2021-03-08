module.exports = {
  siteMetadata: {
    title: "My Gatsby Site",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        jsxPragma: 'jsx',
        allExtensions: true
      }
    }
  ],
};
