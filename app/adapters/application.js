import { run, next } from '@ember/runloop';
import { computed } from '@ember/object';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import UrlTemplates from 'ember-data-url-templates';
import config from 'voice-example-emberjs/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, UrlTemplates, {
  host: config.host,
  namespace: 'v1',
  authorizer: 'authorizer:application',
  headers: computed(function () {
    if (config.accountId) {
      return {
        'X-Account-ID': config.accountId,
      };
    }
    return {
      'X-Account-Key': config.accountKey,
    };
  }).volatile(),

  urlTemplate: '{+host}/{+namespace}/{pathForType}{/id}',
});
