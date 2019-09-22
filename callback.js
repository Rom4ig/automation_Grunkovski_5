function doHomework(subject, callback) {
  alert('Starting my ${subject} homework.');
  callback();
}

doHomework('JS', function() {
  alert('Finished my homework');
});