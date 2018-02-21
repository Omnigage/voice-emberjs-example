import Mirage from 'ember-cli-mirage';
import Utils from 'voice-example-emberjs/mirage/helpers/util';

export default function() {

  /**
   * /identity/v1 API
   */
  this.namespace = '/identity/v1';

  // Authentication
  this.post('/oauth2/tokens', (schema, request) => {
    const body = Utils.requestToObject(request);
    const username = body.get('username');
    const password = body.get('password');

    if (!username && !password) {
      // If both inputs are empty, simulate an 'invalid_grant'
      return new Mirage.Response(400, {}, {
        error: 'invalid_grant',
        error_description: 'Incorrect username and/or password.',
      });
    } else if (username && password) {
      // If both are provided, will simulate a success
      return new Mirage.Response(200, {}, {
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'tGzv3JOkF0XG5Qx2TlKWIA',
      });
    }

    // If either the username and password are not provided, will treat
    // the request as malformed. This is specifically for testing the
    // difference between 'invalid_request' and an 'invalid_grant'.
    // From a users perspective, anything other than an 'invalid_grant'
    // is a client/server error.
    return new Mirage.Response(400, {}, {
      error: 'invalid_request',
      error_description: 'The request was malformed.',
    });
  });

  this.post('/oauth2/revoke', () => {
    return new Mirage.Response(200, {}, {});
  });
}
