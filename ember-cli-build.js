/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const EmberAppConfig = require('./config/environment.js');
let Funnel = require('broccoli-funnel');
let mergeTrees = require('broccoli-merge-trees');

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

  // Copy only the relevant files:
  var internationalTelImages = new Funnel('node_modules/intl-tel-input', {
   srcDir: 'build/img',
   include: ['*.png'],
   destDir: '/assets/images/intl-tel-input'
  });

  // International Telephone Input - https://github.com/Bluefieldscom/intl-tel-input
  app.import('node_modules/intl-tel-input/build/js/intlTelInput.min.js');
  app.import('node_modules/intl-tel-input/build/css/intlTelInput.css');
  // International Telephone Input - libphonenumber utils
  app.import('node_modules/intl-tel-input/build/js/utils.js');

  return mergeTrees([app.toTree(), internationalTelImages], {overwrite: true});
};
