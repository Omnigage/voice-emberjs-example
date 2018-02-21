import Mixin from '@ember/object/mixin';

import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Mixin.create({
  create() {
    // Create the route using the normal technique:
    const route = this._super(...arguments);

    const authenticationRouteMixinApplied = ApplicationRouteMixin.detect(route) ||
      AuthenticatedRouteMixin.detect(route) ||
      UnauthenticatedRouteMixin.detect(route);

    if (!authenticationRouteMixinApplied) {
      // The route was not created with any of the authentication-related route
      // mixins. Modify route so it requires authentication to be accessed:
      AuthenticatedRouteMixin.apply(route);
    }

    return route;
  },
});
