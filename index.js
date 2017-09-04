
const API_BASE = 'http://smmdb.ddns.net/api/';

var fs = require('fs'),
	request = require('request').defaults({ encoding: null }),
	querystring = require('querystring');

module.exports = {
	'config': {
        'API_KEY': null,
        'errors': {
        	'no_api_key': 'No API key provided'
        }
    },
	apiKey: function(key) {
  		this.config.API_KEY = key;
	},
	getStats: function(cb) {
		request(API_BASE + 'getstats', (error, response, body) => {
			if (error) return cb(error);
			if (!response || response.statusCode !== 200) return cb('Invalid response code');
			body = JSON.parse(body);
			return cb(null, body);
		});
	},
	searchCourses: function(query, cb) {
		query = querystring.stringify(query);
		request(API_BASE + 'getcourses?' + query, (error, response, body) => {
			if (error) return cb(error);
			if (!response || response.statusCode !== 200) return cb('Invalid response code');
			body = JSON.parse(body);
			return cb(null, body);
		})
	},
	downloadCourse: function(courseId, target, cb) {
		var req = request({
	        method: 'GET',
	        uri: API_BASE + 'downloadcourse?id=' + courseId + '&type=zip'
	    });

	    var out = fs.createWriteStream(target + '/smm-course-' + courseId + '.zip');
		req.pipe(out);
		
		req.on('error', (error) => {
			return cb(error);
		});

		out.on('error', (error) => {
			return cb(error);
		});

		out.on('finish', () => {
			return cb();
		});
	},
	uploadCourse: function(local_course, cb) {
		if (!this.config.API_KEY) {
			return cb(this.config.errors.no_api_key);
		}

		var delimiter;
		if (local_course.includes('/')) {
			delimiter = '/';
		} else if (local_course.includes('\\')) {
			delimiter = '\\';
		} else {
			return cb('Cannot find file delimiter');
		}

		var name = local_course.split(delimiter),
			name = name[name.length - 1].replace(/\.[^/.]+$/, '');

		request({
			method: 'POST',
			url: API_BASE + 'uploadcourse',
			useElectronNet: false,
			body: fs.readFileSync(local_course),
			headers: {
				'Authorization': 'APIKEY ' + this.config.API_KEY,
				'Content-Type': 'application/octet-stream',
				'Filename': name
			}
		}, (error, response, body) => {
			if (error) return cb(error);
			if (!response || response.statusCode !== 200) return cb('Invalid response code');
			body = JSON.parse(body.toString());
			return cb(null, body);
		});
	},
	starUnstarCourse: function(courseId, cb) {
		if (!this.config.API_KEY) {
			return cb(this.config.errors.no_api_key);
		}
		request({
			method: 'POST',
			url: API_BASE + 'starcourse?id=' + courseId,
			useElectronNet: false,
			headers: {
			  	'Authorization': 'APIKEY ' + this.config.API_KEY
			}
		}, (error, response, body) => {
			if (error) return cb(error);
			if (!response || response.statusCode !== 200) return cb('Invalid response code');
			body = JSON.parse(body);
			return cb(null, body);
		});
	}
}