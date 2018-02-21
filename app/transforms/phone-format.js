import DS from 'ember-data';

export default DS.Transform.extend({
  removeNonNumericCharacters(value) {
    value = value.replace(';ext=', 'x');
    const newValue = value.replace(/[^0-9\x#,]/g, '');
    return newValue;
  },
  serialize(serialized) {
    if (serialized) {
      return `+${this.removeNonNumericCharacters(serialized)}`;
    }
    // important to check for empty string to include attribute in request
    if (serialized === '') {
      return serialized;
    }
    return null;
  },
  deserialize(deserialized) {
    if (deserialized) {
      // replace with more easily parsed extension distinguisher
      deserialized.replace(';ext=', 'x');
      return deserialized;
    }
    return null;
  },
});
