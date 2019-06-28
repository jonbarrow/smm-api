const API_BASE = 'https://smmdb.ddns.net/api/';

let fs = require('fs');
let request = require('request').defaults({ encoding: null }),
let querystring = require('querystring');

const { promisify } = require("util");
const promiseRequest = promisify(request);

let API_key = null;

function getBody(object, callback=null) {
	if (callback) {
		request(object, (error, response, body) => {
			if (error) return callback(error);
			if (!response || response.statusCode !== 200) return callback('Invalid response code');
			return callback(null, body);
		});
	} else {
		let { body, statusCode, responce } = promiseRequest(object);
		if (!responce || statusCode !== 200) return 'Invalid response code';
		return body;
	}
}

module.exports = {
	apiKey: (userKey) => {
		API_key = userKey;
	},
	getStats: (callback=null) => {
		return getbody({ url: API_BASE + 'getstats', json: true }, callback);
	},
	searchCourses: (query, callback=null) => {
		let query = querystring.stringify(query);
		return getbody({ url: API_BASE + 'getcourses?' + query, json: true }, callback);
	},
	downloadCourse: (courseId, target, callback) => {
		var req = request({
			method: 'GET',
			uri: API_BASE + 'downloadcourse?id=' + courseId + '&type=zip'
		});

		var out = fs.createWriteStream(target + '/smm-course-' + courseId + '.zip');
		req.pipe(out);

		req.on('error', (error) => {
			return callback(error);
		});

		out.on('finish', () => {
			return callback();
		});
	},
	uploadCourse: (buffer, callback=null) => {
		if (!API_key || API_KEY.trim() == '') {
			if (callback)
				return callback('No API key provided');
			else
				return 'No API key provided';
		}

		let object = {
			method: 'POST',
			url: API_BASE + 'uploadcourse',
			useElectronNet: false,
			body: buffer,
			headers: {
				'Authorization': 'APIKEY ' + API_KEY,
				'Content-Type': 'application/octet-stream'
			},
			json: true
		};

		return getbody(object, callback);
	},
	starUnstarCourse: function(courseId, callback=null) {
		if (!API_key || API_KEY.trim() == '') {
			if (callback)
				return callback('No API key provided');
			else
				return 'No API key provided';
		}

		let object = {
			method: 'POST',
			url: API_BASE + 'starcourse?id=' + courseId,
			useElectronNet: false,
			headers: {
			  	'Authorization': 'APIKEY ' + API_KEY
			},
			json: true
		};

		return getbody(object, callback);
	}
}
