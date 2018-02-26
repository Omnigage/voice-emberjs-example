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
    // ensure that accountId does not leak from other tests
    config.accountId = null;
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

test('Check for failure making a call /', function(assert) {
    server.post('/calls',
        {
            errors: [
                {
                    'status': '400',
                    'title':  'Bad Request',
                    'detail': 'Generic error adding call.'
                },
                {
                    'title':  'Validation',
                    'detail': 'The field data.attributes.to is required.',
                    'source': {
                        'pointer': '/data/attributes/to',
                    },
                },
                {
                    'title':  'Validation',
                    'detail': 'Generic error with source.parameter',
                    'source': {
                        'parameter': 'filter[to]',
                    },
                },
            ]
        },
        400
    );
    authenticateSession(application);
    visit('/');

    andThen(function() {
        assert.equal(currentPath(), 'index', 'Redirect to index');

        fillIn('#from-field', '+15554443333');
        fillIn('#to-field', '+14443332222');
        selectChoose('.callerId', 'Main');

        click(':submit');
    });

    andThen(function() {
        assertIn(assert, find('.alert').text(), 'not successful', 'Check for general error message.');
        assert.equal(find('.alert li').length, 3, 'Ensure 3 errors in error list, generic errors.');
        assertIn(assert, find('.alert li').text(), 'Generic error adding call', 'Check for generic error message in list.');
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

test('Check for refreshed request clicking records /', function(assert) {
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
    });

    andThen(function() {
        var requests = getPretenderRequest(server, 'GET', 'calls');
        var request1 = requests[0];

        assert.equal(requests.length, 1, 'Only 1 request to fetch /calls');
        assert.equal(request1.url, '/v1/calls?include=result&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=-created-at');

        click('.nav-link:eq(1)');
    });

    andThen(function() {
        var requests = getPretenderRequest(server, 'GET', 'calls');
        var request1 = requests[0];

        assert.equal(requests.length, 2, '2 requests to fetch /calls');
        assert.equal(request1.url, '/v1/calls?include=result&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=-created-at');
    });
});
