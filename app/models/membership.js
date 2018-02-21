import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  account: DS.belongsTo('account', { async: true }),

  createdAt: attr(),
  updatedAt: attr(),
});
