import { computed } from '@ember/object';
import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  parentCall: DS.belongsTo('call', { async: true, inverse: null }),
  callerId: DS.belongsTo('caller-id', { async: true, inverse: null }),

  // will not force a FETCH to grab full record
  // will reference id already within the local store instead
  parentCallId: computed('parentCall', function () {
    return this.belongsTo('parentCall').id();
  }),

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
