import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  callerId: belongsTo({ inverse: null }),
  // contact: belongsTo(),
  parentCall: belongsTo('call', { inverse: null }),
  // envelope: belongsTo({ inverse: null }),
  // result: belongsTo('call-result', { inverse: null }),
  // recordedFile: belongsTo('file'),
});
