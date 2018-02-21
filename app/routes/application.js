import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import SecureDefaultRouteFactory from 'voice-example-emberjs/mixins/routes/secure-default-route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from 'voice-example-emberjs/config/environment';

Route.reopenClass(SecureDefaultRouteFactory);

export default Route.extend(ApplicationRouteMixin, {
  session: service('session'),
  sessionAuthenticated() {
    this._super();
    this.setupAccount(this.controller);
  },
  setupController(controller) {
    if (this.get('session.isAuthenticated')) {
      this.setupAccount(controller);
    }
  },
  setupAccount(controller) {
    // setup the account
  },
});
