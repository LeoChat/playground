const path = require('path');
const merge = require('webpack-merge');

function override(config, env) {
  return merge(config, {
    resolve: {
      modules: [
        path.resolve(__dirname, 'git_modules'),
      ],
    },
  });
};

module.exports = override;
