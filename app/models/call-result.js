import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  call: DS.belongsTo('call', { async: true, inverse: null }),

  kind: attr(),
  digits: attr(),
  speech: attr(),
  phoneNumber: attr(),

  createdAt: attr(),
  updatedAt: attr(),
});
