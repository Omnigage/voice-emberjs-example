import Mirage, { faker }  from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  phoneNumber() { return `+${faker.phone.phoneNumberFormat(2).replace(/-/g, '')}`; },
  label() { return faker.name.lastName(); },
  status() { return 'success'; },
  isArchived() { return false; },

  createdAt() { return moment(faker.date.past(), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },
  updatedAt() { return moment(faker.date.past(), moment.ISO_8601).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },
});
