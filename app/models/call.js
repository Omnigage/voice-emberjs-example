import { computed } from '@ember/object';
import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  parentCall: DS.belongsTo('call', { async: true, inverse: null }),
  callerId: DS.belongsTo('caller-id', { async: true, inverse: null }),
  // envelope: DS.belongsTo('envelope', { async: true, inverse: 'call' }),
  // result: DS.belongsTo('call-result', { async: true, inverse: null }),
  // contact: DS.belongsTo('contact', { async: true, inverse: null }),
  // recordedFile: DS.belongsTo('file', { async: true }),

  // will not force a FETCH to grab full record
  // will reference id already within the local store instead
  parentCallId: computed('parentCall', function () {
    return this.belongsTo('parentCall').id();
  }),
  // envelopeId: computed('envelope', function () {
  //   return this.belongsTo('envelope').id();
  // }),
  // recordedFileId: computed('recordedFile', function () {
  //   return this.belongsTo('recordedFile').id();
  // }),
  // contactId: computed('contact', function () {
  //   return this.belongsTo('contact').id();
  // }),

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
