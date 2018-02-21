import Ember from 'ember';

export default {
  requestToObject(request) {
    let contentType;
    let body = {};

    // Attempt to derive content type
    if ('content-type' in request.requestHeaders) {
      contentType = request.requestHeaders['content-type'];
    }

    // Handle url encoded
    if (contentType.indexOf('x-www-form-urlencoded') > -1) {
      const segments = request.requestBody.split('&');
      for (let i = 0; i < segments.length; i++) {
        const params = segments[i].split('=');
        body[params[0]] = params[1];
      }
    } else {
      body = JSON.parse(request.requestBody);
    }

    return Ember.Object.create(body);
  },
};
