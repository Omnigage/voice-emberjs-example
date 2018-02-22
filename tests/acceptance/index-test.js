import { module, test } from 'qunit';
import startApp from 'voice-example-emberjs/tests/helpers/start-app';
import destroyApp from 'voice-example-emberjs/tests/helpers/destroy-app';
import { authenticateSession } from 'voice-example-emberjs/tests/helpers/ember-simple-auth';
import config from 'voice-example-emberjs/config/environment';

var application;

module('Acceptance: Index', {
    beforeEach: function() {
        application = startApp();
        server.create('caller-id', {
            label: 'Main',
            phoneNumber: '+15554443333',
            status: 'success',
        });
        server.create('membership');
        server.create('call');
        let account = server.create('account', {
            key: 'bell-labs',
        });
        server.db.memberships.update(1, {
            account: account,
        });
    },
    afterEach: function() {
        destroyApp(application);
    }
});

test('Check for X-Account-Key in requestHeaders /', function(assert) {
    authenticateSession(application);
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index', 'Redirect to index');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'GET')[0];

        assertIn(assert, request.requestHeaders['X-Account-Key'], 'bell-labs', 'Check that accountKey is used if accountId is not defined/null in request header.');
    });
});

test('Check for success making a call /', function(assert) {
    authenticateSession(application);
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index', 'Redirect to index');

        fillIn('#from-field', '+15554443333');
        fillIn('#to-field', '+14443332222');
        // set the callerId service by selecting a callerId within the component
        selectChoose('.callerId', 'Main');

        click(':submit');
    });

    andThen(function() {
        var request = getPretenderRequest(server, 'POST', 'calls')[0];
        var responseBody = JSON.parse(request.requestBody);

        assert.equal(request.url, '/v1/calls');
        assert.equal(responseBody.data.attributes['to'], '+14443332222', 'Check for to phone-number');
        assert.equal(responseBody.data.attributes['from'], '+15554443333', 'Check for from phone-number');
        assert.equal(responseBody.data.attributes['action'], 'dial', 'Check for dial action');

        assertIn(assert, request.requestHeaders['X-Account-Key'], 'bell-labs', 'Check that accountKey is used if accountId is not defined/null in request header.');
    });
});

test('Check for expected content loading call logs /', function(assert) {
    server.db.calls.update(1, {
        to: '+15554443333',
        from: '+15554443333',
        direction: 'inbound',
        createdAt: '2020-01-01T10:00:00.000+00:00',
    });
    authenticateSession(application);
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index');

        var cells = find('table tbody tr').eq(0).find('td');

        assert.equal(cells.eq(0).text().trim(), '+15554443333', 'Check for from.');
        assert.equal(cells.eq(1).text().trim(), '+15554443333', 'Check for contact to.');
        assert.equal(cells.eq(2).text().trim(), 'inbound', 'Check for direction.');
        assert.equal(cells.eq(3).text().trim(), '2020-01-01T10:00:00.000+00:00', 'Check for created at.');
    });
});
