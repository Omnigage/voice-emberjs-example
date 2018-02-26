import { computed } from '@ember/object';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import config from 'voice-example-emberjs/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: config.host,
  namespace: 'v1',
  authorizer: 'authorizer:application',
  headers: computed(function () {
    return {
      'X-Account-Key': config.accountKey,
    };
  }).volatile(),
});
