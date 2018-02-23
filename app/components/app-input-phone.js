import { next } from '@ember/runloop';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import TextField from '@ember/component/text-field';

export default TextField.extend({
  initPhoneMask: on('didInsertElement', function () {
    let $input = this.$();
    let value = $input.val();
    // fixes missing required characters before formatting
    if (value.length > 0) {
      if (value.charAt(0) !== '+') {
        this.set('value', `+${value}`);
      }
    }

    $input.intlTelInput({
      nationalMode: false,
      preferredCountries: ['us', 'gb', 'ca'],
    });
    // intlTelInput - Workaround for ember not picking up on
    // the plugins attempt to hide the country code with .blur()
    // we must manually set the input value to empty
    $input.on('blur', () => {
      let blurValue = $input.val();
      if (blurValue.length < 1) {
        this.set('value', '');
      } else {
        // only sets the formatting on blur
        $input.intlTelInput('setNumber', blurValue);
      }
    });
  }),
  setNumber: observer('value', function () {
    // lets the jQuery .val detect updated value before setting
    next(() => {
      let $input = this.$();
      let inputValue = $input.val();
      if (this.get('value') && this.get('value').length > 1) {
        // intlTelInput - Workaround for plugin not detecting
        // if ember updates the input value outside of user interaction
        if (!$input.is(':focus')) {
          $input.intlTelInput('setNumber', inputValue);
        }
      }
    });
  }),
});
