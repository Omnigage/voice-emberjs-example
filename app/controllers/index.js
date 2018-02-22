import { computed, observer, get } from '@ember/object';
import Controller from '@ember/controller';
import DS from 'ember-data';
import config from 'voice-example-emberjs/config/environment';

export default Controller.extend({
  sort: '-createdAt',
  callerId: null,
  currentAccount: null,
  accountContent: computed(function () {
    return this.store.query('membership', {
      'filter[is-active]': true,
      sort: '-created-at',
      include: 'account',
    }).then((memberships) => {
      this.set('currentAccount', memberships.get('firstObject'));
      return memberships;
    });
  }),
  callerIdContent: computed(function () {
    return DS.PromiseObject.create({
      promise: this.get('store').query('caller-id', {
        'page[offset]': 0,
        'page[limit]': 100,
        'filter[status]': 'success',
        sort: '-created-at',
      }),
    });
  }),
  setAccountKeyForReqHeaders: observer('currentAccount', function () {
    // setting the accountKey to be used within any future requests headers as `X-Account-Key`
    if (this.get('currentAccount')) {
      config.accountKey = this.get('currentAccount.account.key');
    }
  }),
  reset() {
    this.setProperties({
      isSuccess: false,
      isFailure: false,
      errors: null,
    });
  },
  // fed into ember-tabular to filter the table
  staticParams: computed(function () {
    return {
      include: 'result',
    };
  }),
  columnOrder: ['from', 'to', 'direction', 'result.kind', 'createdAt'],
  listDirection: [
    {
      label: 'Inbound & Outbound',
      value: 'inbound-outbound',
    },
    {
      label: 'Inbound',
      value: 'inbound',
    },
    {
      label: 'Outbound',
      value: 'outbound',
    },
  ],
  actions: {
    makeCall() {
      this.reset();
      // create call object/record
      let call = this.get('store').createRecord('call', {
        to: this.get('to'),
        from: this.get('from'),
        action: 'dial',
        callerId: this.get('callerId'),
      });
      // save call record making request to API
      call.save().then(
        () => {
          this.setProperties({
            isSuccess: true,
            successMessage: 'Success! Call was made',
          });
        },
        (error) => {
          // error
          this.setProperties({
            isFailure: true,
            errors: get(error, 'errors'),
            failureMessage: 'Error! Call was not successful',
          });
        }
      );
    },
  },
});
