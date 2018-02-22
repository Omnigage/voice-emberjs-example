import destroyApp from 'voice-example-emberjs/tests/helpers/destroy-app';
import { module, test } from 'qunit';
import startApp from 'voice-example-emberjs/tests/helpers/start-app';

var application;

module('Acceptance: Login/Logout', {
    beforeEach: function() {
        application = startApp();
        server.loadFixtures();
    },
    afterEach: function() {
        destroyApp(application);
    }
});

test('Check for login authentication failure', function(assert) {
    visit('/login');

    andThen(function() {
        assert.equal(currentPath(), 'login');
    });

    andThen(function() {
        click('form :submit');

        andThen(function() {
            // Verify still on login route
            assert.equal(currentPath(), 'login');

            // Check for invalid login error
            assertIn(assert, find('.alert').text(), 'Invalid credentials', 'Check for error.');
        });
    });
});

test('Check for login general failure', function(assert) {
    visit('/login');

    andThen(function() {
        assert.equal(currentPath(), 'login');
    });

    andThen(function() {
        fillIn('#identification-field', 'john.smith@gmail.com');

        click('form :submit');

        andThen(function() {
            // Verify still on login route
            assert.equal(currentPath(), 'login');

            // Check for invalid login error
            assertIn(assert, find('.alert').text(), 'There was an error', 'Check for error.');
        });
    });
});

test('Check for login success', function(assert) {
    visit('/login');

    andThen(function() {
        assert.equal(currentPath(), 'login');
    });

    andThen(function() {
        fillIn('#identification-field', 'john.smith@gmail.com');
        fillIn('#password-field', 'opensesame');

        click('form :submit');

        andThen(function() {
            // Verify correctly routed
            assert.equal(currentPath(), 'index');

            var request = getPretenderRequest(server, 'POST')[0];

            assert.equal(request.url, '/identity/v1/oauth2/tokens');
        });
    });
});
