var assert = require('assert');


describe('my webdriverio tests', function () {
    it('Google title test', function () {
        browser.url('http://www.google.com')
        const title = browser.getTitle();
        assert(title === 'Google');
    });

    it('SSL Google title test', function () {
        browser.url('https://www.google.com');
        const title = browser.getTitle();
        assert(title === 'Google');
    });
});