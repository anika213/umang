const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    config.resolve.fallback = {
      crypto: false,
    };
    return config;
  }
);
