import Route from '@ember/routing/route';

export default Route.extend({
  resetController(controller, isExiting) {
    this._super(...arguments);
    if (isExiting) {
      controller.setProperties({
        isSuccess: false,
        isFailure: false,
        errors: null,
      });
    }
  },
});
