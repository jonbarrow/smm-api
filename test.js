const smm = require('./');

smm.apiKey('');

smm.getStats((error, stats) => {
	if (error) throw error;
	console.log(stats);
});

smm.searchCourses({
	title: 'Test'
}, (error, courses) => {
	if (error) throw error;
	console.log(courses);
});

smm.downloadCourse('59722397f160681a439d9b92', './', (error) => {
	if (error) throw error;
	console.log('Done');
});

smm.starUnstarCourse('59ab69804fa8fa5fb0946df3', (error, course_data) => {
	if (error) throw error;
	console.log(course_data);
})

smm.uploadCourse('Course.zip', (error, course_data) => {
	if (error) throw error;
	console.log(course_data);
});