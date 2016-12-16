exports.browscope = function browscope(proxyUrl) {
    this.request = require('request');
    this.jar = this.request.jar();

    this.normalizeUrl = function (url) {
        if (proxyUrl.indexOf('http') == -1) return 'http://' + url;
        return url;
    };

    this.setProxy = function (proxyUrl) {
        this.request = this.request.defaults({proxy: this.normalizeUrl(proxyUrl)});
    };

    if (proxyUrl) this.setProxy(proxyUrl);

    this.clearProxy = function () {
        this.request = this.request.defaults({proxy: null});
    };

    this.setHeaders = function (headers) {
        this.headers = headers;
    };

    this.clearHeaders = function () {
        delete this.headers;
    };

    this.createParams = function (url, formData, jsonData) {
        var params = {};
        params.url = this.normalizeUrl(url);
        params.jar = this.jar;
        if (formData) params.form = formData;
        if (jsonData) params.json = jsonData;
        if (this.headers) params.headers = this.headers;
        return params;
    };

    this.post = function (url, formData, callback) {
        console.log('POST: ' + url);
        this.request.post(this.createParams(url, formData), function (err, httpResponse, body) {
            callback(body, httpResponse, err);
        });
    };

    this.postJson = function (url, jsonData, callback) {
        console.log('POST JSON: ' + url);
        this.request.post(this.createParams(url, null, jsonData), function (err, httpResponse, body) {
            callback(body, httpResponse, err);
        });
    };

    this.get = function (url, callback) {
        console.log('GET: ' + url);
        this.request.get(this.createParams(url), function (err, httpResponse, body) {
            callback(body, httpResponse);
        });
    };
};
