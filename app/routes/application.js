import Route from '@ember/routing/route';
import SecureDefaultRouteFactory from 'voice-example-emberjs/mixins/routes/secure-default-route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

Route.reopenClass(SecureDefaultRouteFactory);

export default Route.extend(ApplicationRouteMixin);
