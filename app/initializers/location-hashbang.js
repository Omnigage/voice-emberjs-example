/**
  `location-hashbang.js` checks for the presence of a `#!` hashbang,
  removes it and updates the location without a page reload
  or history modification.

  @class LocationHashbang
  @namespace initializers
  @author Micheal Morgan <micheal.morgan@caxiam.com>
*/
export default {
  name: 'location-hashbang',
  initialize() {
    const location = window.location;
    const hash = location.hash;
    let pathname;

    // Check for hashbang and update location removing it
    if (hash.indexOf('#!/') > -1) {
      pathname = location.pathname;

      // Various versions of IE and Opera do not always return a leading slash
      if (pathname.charAt(0) !== '/') {
        pathname = `/${pathname}`;
      }

      // Reconstruct path
      const path = pathname + hash.replace('#!/', '') + location.search;

      // Update location without page reload
      window.history.replaceState({ path: path }, null, path);
    }
  },
};
