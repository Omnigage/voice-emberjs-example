import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  // required by mirage upgrade to 0.4.1
  alwaysIncludeLinkageData: true,
});
