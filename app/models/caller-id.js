import DS from 'ember-data';

const attr = DS.attr;

export default DS.Model.extend({
  phoneNumber: attr('phoneFormat'),
  label: attr(),
  status: attr({ defaultValue: 'pending' }),
  verificationCode: attr(),
  isArchived: attr(),

  createdAt: attr(),
  updatedAt: attr(),
});
