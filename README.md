# What it is
> A NodeJS module for interacting with the SMM (Super Mario Maker) api, designed for Cemu.

---

## Installation
```
    $ npm install --save smm-api
```

## Searching for levels
> smm.search({parameters}, callback);
```
    const smm = require('smm-api');
    
    // Search object is an object of your search parameters. A full list of parameters can be found at http://smmdb.ddns.net/api
    smm.search({
        'order': 'stars', // Search order
        'dir': 'desc',    // Ascending or descending
        'coursetype': 0,  // 0=Own Creation; 1=Recreation; 2=Wii U Dump;
        'difficultyfrom': 2,
        'difficultyto': 2,
    }, function(response) { // The API response
        var response = JSON.parse(response),
            keys = Object.keys(response.courses);
        console.log(keys.length);
        for (var i = 0; i < keys.length; i++) {
            // Logs all level titles
            console.log(response.courses[keys[i]].title);
        }
    });
```

## Staring levels
> smm.starcourse(courseId, callback);
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY');
    
    smm.starcourse(1, function(response) {
        // Stars course `1` if API key is valid
        console.log(response);
    });
```

## Unstaring levels
> smm.unstarcourse(courseId, callback);
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY');
    
    smm.unstarcourse(1, function(response) {
        // Unstars course `1` if API key is valid
        console.log(response);
    });
```

## Completing levels
> smm.complete(courseId, callback);
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY');
    
    smm.complete(1, function(response) {
        // Completes course `1` if API key is valid
        console.log(response);
    });
```

## Uncompleting levels
> smm.uncomplete(courseId, callback);
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY');
    
    smm.uncomplete(1, function(response) {
        // Uncompletes course `1` if API key is valid
        console.log(response);
    });
```

## Downloading levels
> smm.downloadCourse(courseId, target, callback);
```
    const smm = require('smm-api');
    
    smm.downloadCourse(1, 'path/to/download', function() {
        // Downloads course `1`
        console.log('Done downloading');
    });
```

## Uploading levels (Currently does not work)
> smm.uploadCourse(path, callback);
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY');
    
    smm.uploadCourse('path/to/level.zip', function() {
        // Uploads course if API key is valid
        console.log('Done uploading');
    });
```

## Api Key
> smm.apiKey('API_KEY');
```
    const smm = require('smm-api');
    smm.apiKey('API_KEY'); // Used for all functions which require a key
```