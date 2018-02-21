import Mirage, { faker }  from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  name() { return faker.company.companyName(); },
  key() { return this.name.toLowerCase().replace(/ /g, '-'); },
  url() { return `https://${this.key}.omnigage.com`; },
  isActive() { return faker.random.arrayElement([true, false]); },

  createdAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
  updatedAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
});
