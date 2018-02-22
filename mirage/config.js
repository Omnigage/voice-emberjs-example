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

    if (!username && password === '') {
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

  /**
   * /accounts
   */
  this.get('/accounts/:id');


  /**
   * /memberships
   */
  this.get('/memberships', ({ memberships }) => {
    return memberships.all();
  });
  this.get('/memberships/:id');


  /**
   * /v1 Account API
   */
  this.namespace = '/v1';


  /**
   * /caller-ids
   */
  this.get('/caller-ids', ({ callerIds }) => {
    return callerIds.all();
  });
  this.get('/caller-ids/:id');

  /**
   * /calls
   */
  this.get('/calls', ({ calls }) => {
    return calls.all();
  });
  this.get('/calls/:id');
  this.post('/calls', function(schema) {
    let attrs = this.normalizedRequestAttrs();
    let call = schema.calls.create(attrs);
    if (attrs && attrs.to && attrs.from && attrs.callerIdId) {
      attrs.action = null;
      attrs.status = 'queued';
      // when to/from are included we actually return the childCall
      let childCall = schema.calls.create({
        to: attrs.to,
        from: attrs.from,
        parentCall: call,
        status: 'in-progress',
        callerIdId: attrs.callerIdId,
      });
      return childCall;
    }
    return call;
  });
}
