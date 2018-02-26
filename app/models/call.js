import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  parentCall: DS.belongsTo('call', { async: true, inverse: null }),
  callerId: DS.belongsTo('caller-id', { async: true, inverse: null }),
  result: DS.belongsTo('call-result', { async: true, inverse: null }),

  to: attr('phoneFormat'),
  from: attr('phoneFormat'),
  action: attr(),
  status: attr({ defaultValue: 'queued' }),
  direction: attr(),
  kind: attr(),
  duration: attr(),
  hasRecording: attr(),
  startedAt: attr(),
  finishedAt: attr(),

  createdAt: attr(),
  updatedAt: attr(),
});
