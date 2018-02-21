import Mirage, {faker}  from 'ember-cli-mirage';
import moment from 'moment';

export default Mirage.Factory.extend({
  createdAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },
  updatedAt() { return moment(faker.date.past()).format('YYYY-MM-DD'); },

  afterCreate(membership, server) {
    let account = server.create('account');
    membership.update('account', account);
  },
});
