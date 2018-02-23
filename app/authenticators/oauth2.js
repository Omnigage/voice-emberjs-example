import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
import config from 'voice-example-emberjs/config/environment';

const identityAPI = `${config.host}/identity/v1/oauth2/`;

export default OAuth2PasswordGrant.extend({
  session: service(),
  serverTokenEndpoint: `${identityAPI}tokens`,
  serverTokenRevocationEndpoint: `${identityAPI}revoke`,

  authenticationAccessToken: computed('session.session.authenticated.access_token',
  function () {
    return this.get('session.session.authenticated.access_token');
  }),

  // override makeRequest to inject Authentication token into headers
  makeRequest(url, data, headers = {}) {
    if (data && data.grant_type && data.grant_type === 'refresh_token') {
      headers.Authentication = `Bearer ${this.get('authenticationAccessToken')}`;
    }
    return this._super(url, data, headers);
  },
});
