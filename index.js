
try {
    var fs = require('original-fs');
} catch (error) {
  	var fs = require('fs');
}

var request     = require('request').defaults({ encoding: null }),
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
	downloadCourse: function(courseId, target, cb) {
	    var req = request({
	        method: 'GET',
	        uri: 'http://smmdb.ddns.net/courses/'+courseId
	    });

	    var out = fs.createWriteStream(target+'/smm-course-'+courseId+'.rar');
	    req.pipe(out);

	    req.on('end', function() {
	        return cb();
	    });
	},
	uploadCourse: function(path, cb) {

		//return console.log("UPLOADING DOES NOT WORK IN THIS VERSION OF SMM-API.");

		if (!this.config.API_KEY) {
			console.log(this.config.errors['no_api_key']);
			return cb("{'error': '"+this.config.errors['no_api_key']+"'}");
		}

	    var _in = request({
	        method: 'POST',
	        headers: {
	        	'request': 'uploadcourse',
		      	'apikey': this.config.API_KEY		      	
		    },
	        uri: 'http://smmdb.ddns.net/api'
	    });

	    var level = fs.createReadStream(path);

	    var req = level.pipe(_in);

	    req.on('data', function(data) {
            console.log(data.toString());
        });

	    req.on('end', function() {
	        return cb();
	    });  
	},
	search: function(params, cb) {
		var query = querystring.stringify(params);
		apiRequest('GET', 'http://smmdb.ddns.net/api/getcourses?'+query, function(response) {
          	return cb(response.body);
      	});
	},
	starcourse: function(courseId, cb) {
		if (!this.config.API_KEY) {
			console.log(this.config.errors['no_api_key']);
			return cb("{'error': '"+this.config.errors['no_api_key']+"'}");
		}
		var query = querystring.stringify({apikey: this.config.API_KEY, dostar: 1, courseid: courseId});
		apiRequest('GET', 'http://smmdb.ddns.net/api/starcourse?'+query, function(response){
          	return cb(response.body);
      	});
	},
	unstarcourse: function(courseId, cb) {
		if (!this.config.API_KEY) {
			console.log(this.config.errors['no_api_key']);
			return cb("{'error': '"+this.config.errors['no_api_key']+"'}");
		}
		var query = querystring.stringify({apikey: this.config.API_KEY, dostar: 0, courseid: courseId});
		apiRequest('GET', 'http://smmdb.ddns.net/api/starcourse?'+query, function(response){
          	return cb(response.body);
      	});
	},
	complete: function(courseId, cb) {
		if (!this.config.API_KEY) {
			console.log(this.config.errors['no_api_key']);
			return cb("{'error': '"+this.config.errors['no_api_key']+"'}");
		}
		var query = querystring.stringify({apikey: this.config.API_KEY, docomplete: 1, courseid: courseId});
		apiRequest('GET', 'http://smmdb.ddns.net/api/completecourse?'+query, function(response){
          	return cb(response.body);
      	});
	},
	uncomplete: function(courseId, cb) {
		if (!this.config.API_KEY) {
			console.log(this.config.errors['no_api_key']);
			return cb("{'error': '"+this.config.errors['no_api_key']+"'}");
		}
		var query = querystring.stringify({apikey: this.config.API_KEY, docomplete: 0, courseid: courseId});
		apiRequest('GET', 'http://smmdb.ddns.net/api/completecourse?'+query, function(response) {
          	return cb(response.body);
      	});
	}
}

function apiRequest(method, url, cb) {
    request({
       url : url,
       method : method
    }, function(error, response, body) {
       var res = response.headers;
       res.body = body.toString();
       cb(res);
    }); 
}