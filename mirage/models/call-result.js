import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  call: belongsTo({ inverse: null }),
});
