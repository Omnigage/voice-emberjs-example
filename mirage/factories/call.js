import Mirage, {faker}  from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  createdById() { return 1; },
  updatedById() { return 1; },

  to() { return `+${faker.phone.phoneNumberFormat(2).replace(/-/g, '')}`; },
  from() { return `+${faker.phone.phoneNumberFormat(2).replace(/-/g, '')}`; },
  status() { return faker.random.arrayElement(['queued', 'ringing', 'completed', 'failed', 'busy', 'unanswered']); },
  direction() { return faker.random.arrayElement(['outbound', 'inbound']); },
  kind() { return 'native'; },
  duration() { return faker.random.number({ min: 10, max: 800 }); },
  startedAt() { return moment(faker.date.past()).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },
  finishedAt() { return moment(faker.date.past()).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },

  createdAt() { return moment(faker.date.past()).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },
  updatedAt() { return moment(faker.date.past()).format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'); },
});
