import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  callerId: belongsTo({ inverse: null }),
  parentCall: belongsTo('call', { inverse: null }),
});
