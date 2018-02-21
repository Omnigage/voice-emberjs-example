import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  name: attr(),
  key: attr(),
  url: attr(),
  isActive: attr(),

  createdAt: attr(),
  updatedAt: attr(),
});
