module.exports = {
  buildBabelConfig() {
    return {
      // for enabling dynamic import.
      babel: {
        plugins: [require.resolve('ember-auto-import/babel-plugin')],
      },
    };
  },
};
