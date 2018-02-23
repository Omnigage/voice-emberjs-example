/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const EmberAppConfig = require('./config/environment.js');

module.exports = function(defaults) {

  var environment = EmberApp.env(),
    envProductionLike = (environment === 'production'),
    config = new EmberAppConfig(environment);

  var app = new EmberApp(defaults, {
    'fingerprint': {
      'enabled': envProductionLike,
      'extensions': ['js', 'css', 'json', 'ico', 'xml', 'png', 'jpg', 'gif', 'map', 'csv'],
      'prepend': config.assetsURL
    },
    'ember-bootstrap': {
      'bootstrapVersion': 3,
      'importBootstrapFont': true,
      'importBootstrapCSS': true
    },
    'ember-power-select': {
      theme: 'bootstrap'
    }
  });

  return app.toTree();
};
