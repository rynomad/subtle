var child_process = require('child_process');
child_process.exec('npm -v', function (error, stdout, stderr) {
	var version = stdout.toString();
	var pure_js = version[0] === '2';
	console.log(pure_js);
	if (pure_js) {
		console.log('PURE JS');
	} else {
		child_process.exec('npm install git+https://github.com/rynomad/ecc.git');
	}
});
