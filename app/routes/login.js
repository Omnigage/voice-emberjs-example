import { get } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Login',
  session: service('session'),
  defaultFailureMessage: 'There was an error in attempting to authenticate.',
  actions: {
    authenticate() {
      this.setProperties({
        'controller.isFailure': false,
        'controller.isProcessing': true,
      });
      let identification = this.get('controller.identification');
      let password = this.get('controller.password');
      if (!identification) {
        identification = '';
      }
      if (!password) {
        password = '';
      }
      this.get('session')
        .authenticate('authenticator:oauth2', identification, password)
        .then(this.success.bind(this), this.failure.bind(this));
    },
  },
  success() {
    this.reset();
    this.transitionTo('index');
  },
  failure(response) {
    this.reset();
    this.setProperties({
      'controller.isFailure': true,
      'controller.failureMessage': 'There was an error in attempting to authenticate.',
    });

    if (get(response, 'error') === 'invalid_grant') {
      this.setProperties({
        'controller.isFailure': true,
        'controller.isAuthFailure': true,
        'controller.failureMessage': 'Invalid credentials, check email/password combination and try again.',
      });
    }
  },
  reset() {
    this.setProperties({
      'controller.isProcessing': false,
      'controller.isFailure': false,
      'controller.isAuthFailure': false,
      'controller.failureMessage': null,
    });
  },
  resetController(controller, isExiting) {
    if (isExiting) {
      this.reset();
    }
  },
});
