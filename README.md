# What it is
> A NodeJS module for interacting with the SMMDB (Super Mario Maker) api.

---

## Installation
```

$ npm i --save smm-api

```

### apiKey('KEY')
> (optional) Sets the application SMMDB API key. Key is used for uploading and staring courses

Accepts one argument:
* `key`: SMMDB API Key
```javascript
const smm = require('smm-api');
    
smm.apiKey('KEY');
```

### getStats(callback)
> Gets overall SMMDB stats

Accepts one argument:
* `callback`: Callback run when method finishes
    * `error`: An error, if there was one
    * `stats`: SMMDB stats
```javascript
const smm = require('smm-api');

smm.getStats((error, stats) => {
	if (error) throw error;
	console.log(stats);
});
```
If no error, returns object:
* `courses`: Number of SMM courses (total 3DS and WiiU)
* `courses64`: Number of SM64M (Super Mario 64 Maker) levels
* `accounts`: Number of accounts

## searchCourses({parameters}, callback)
> Searchs SMMDB courses

Accepts two arguments:
* `parameters`: Search parameters
* `callback`: Callback run when method finishes
    * `error`: An error, if there was one
    * `courses`: Courses list
For a list of accepted parameters, see https://github.com/Tarnadas/smmdb#receive-course-list
```javascript
const smm = require('smm-api');

smm.searchCourses({
	title: 'Test'
}, (error, courses) => {
	if (error) throw error;
	console.log(courses);
});
```

## starUnstarCourse(courseId, callback)
> Star and unstar a course (requires API key)

Accepts one argument:
* `callback`: Callback run when method finishes
    * `error`: An error, if there was one
    * `course_data`: Data of the stared/unstared coures
```javascript
const smm = require('smm-api');
smm.apiKey('API_KEY');

// Stars the course
smm.starUnstarCourse('59ab69804fa8fa5fb0946df3', (error, course_data) => {
	if (error) throw error;
	console.log(course_data);
    // Course is now stared by you
});

// Unstars the course (call method 2nd time)
smm.starUnstarCourse('59ab69804fa8fa5fb0946df3', (error, course_data) => {
	if (error) throw error;
	console.log(course_data);
    // Course is now unstared by you
});
```

## downloadCourse(courseId, target, callback)
> Downloads course by ID to a specified folder

Accepts three arguments:
* `courseId`: ID of the course
* `path`: Path to folder to save course to
* `callback`: Callback run when method finishes
    * `error`: An error, if there was one
```javascript
const smm = require('smm-api');
    
smm.downloadCourse('59722397f160681a439d9b92', './', (error) => {
	if (error) throw error;
	console.log('Done');
})
```

## uploadCourse(path\_to\_course\_zip, callback)
> Uploads course from given path (requires API key)

Accepts two arguments:
* `path_to_course_zip`: Path to compressed course folder
* `callback`: Callback run when method finishes
    * `error`: An error, if there was one
    * `course_data`: Data of the uploaded course
```javascript
const smm = require('smm-api');
smm.apiKey('API_KEY');
    
smm.uploadCourse('Course.zip', (error, course_data) => {
	if (error) throw error;
	console.log(course_data);
})
```