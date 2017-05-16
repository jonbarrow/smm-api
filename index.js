import Request from 'request'
import queryString from 'querystring'

import fs from 'fs'

const request = Request.defaults({ encoding: null });

const config = {
    API_KEY: null,
    errors: {
        noAPIKey: 'No API key provided'
    }
};

function apiRequest(method, url, cb) {
    request({
        url : url,
        method : method
    }, (error, response, body) => {
        let res = response.headers;
        res.body = body.toString();
        cb(res);
    });
}

function setApiKey (key) {
    config.API_KEY = key;
}

export function downloadCourse (courseId, target, cb) {
    let req = request({
        method: 'GET',
        uri: 'http://smmdb.ddns.net/courses/'+courseId
    });

    let out = fs.createWriteStream(target+'/smm-course-'+courseId+'.rar');
    req.pipe(out);

    req.on('end', function() {
        return cb();
    });
}

export function uploadCourse (path, cb) {

    //return console.log("UPLOADING DOES NOT WORK IN THIS VERSION OF SMM-API.");

    if (!this.config.API_KEY) {
        console.log(this.config.errors.noAPIKey);
        return cb(JSON.stringify({ error: config.errors.noAPIKey }));
    }

    let _in = request({
        method: 'POST',
        headers: {
            'request': 'uploadcourse',
            'apikey': this.config.API_KEY
        },
        uri: 'http://smmdb.ddns.net/api'
    });

    let level = fs.createReadStream(path);

    let req = level.pipe(_in);

    req.on('data', data => {
        console.log(data.toString());
    });

    req.on('end', () => {
        return cb();
    });
}

export function search (params, cb) {
    let query = queryString.stringify(params);
    apiRequest('GET', 'http://smmdb.ddns.net/api/getcourses?'+query, response => {
        return cb(JSON.parse(response.body));
    });
}

export function starCourse (courseId, cb) {
    if (!this.config.API_KEY) {
        console.log(this.config.errors.noAPIKey);
        return cb(JSON.stringify({ error: config.errors.noAPIKey }));
    }
    let query = queryString.stringify({apikey: this.config.API_KEY, dostar: 1, courseid: courseId});
    apiRequest('GET', 'http://smmdb.ddns.net/api/starcourse?'+query, response => {
        return cb(JSON.parse(response.body));
    });
}

export function unstarCourse (courseId, cb) {
    if (!this.config.API_KEY) {
        console.log(this.config.errors.noAPIKey);
        return cb(JSON.stringify({ error: config.errors.noAPIKey }));
    }
    let query = queryString.stringify({apikey: this.config.API_KEY, dostar: 0, courseid: courseId});
    apiRequest('GET', 'http://smmdb.ddns.net/api/starcourse?'+query, response => {
        return cb(JSON.parse(response.body));
    });
}

export function completeCourse (courseId, cb) {
    if (!this.config.API_KEY) {
        console.log(this.config.errors.noAPIKey);
        return cb(JSON.stringify({ error: config.errors.noAPIKey }));
    }
    let query = queryString.stringify({apikey: this.config.API_KEY, docomplete: 1, courseid: courseId});
    apiRequest('GET', 'http://smmdb.ddns.net/api/completecourse?'+query, response => {
        return cb(JSON.parse(response.body));
    });
}

export function uncompleteCourse(courseId, cb) {
    if (!this.config.API_KEY) {
        console.log(this.config.errors.noAPIKey);
        return cb(JSON.stringify({ error: config.errors.noAPIKey }));
    }
    let query = queryString.stringify({apikey: this.config.API_KEY, docomplete: 0, courseid: courseId});
    apiRequest('GET', 'http://smmdb.ddns.net/api/completecourse?'+query, response => {
        return cb(JSON.parse(response.body));
    });
}