var fs = require('fs');
var filesCount = 0;


function traverseDirectory(dirname, callback) {
	var directory = [];
	var inc = false;
	fs.readdir(dirname, function (err, list) {
		dirname = fs.realpathSync(dirname);
		if (err) {
			return callback(err);
		}
		var listlength = list.length;

		list.forEach(function (file) {
			file = dirname + '\\' + file;
			fs.stat(file, function (err, stat) {
				if (file.includes(".")) {
					var lastDot = file.lastIndexOf('.'),
						fileLength = file.length,
						extLength = fileLength - lastDot;

					var ext = file.substring(lastDot + 1, fileLength);

					if (ext === process.argv[2]) {
						fs.readFile(file, function (err, data) {
							if (err) throw err;
							if (data.indexOf(process.argv[3]) >= 0) {
								directory.push(file);
								filesCount++;
								console.log(file);



							}


						});



					}

				}


				if (stat && stat.isDirectory()) {
					traverseDirectory(file, function (err, parsed) {
						directory = directory.concat(parsed);
						if (!--listlength) {
							callback(null, directory);
						}
					});

				}

				else {

					if (!--listlength) {
						callback(null, directory);

					}
				}
			});


		});

	});


}


//if we didnt do a search and simply ran the main command
if (process.argv[2] == undefined)
	console.log("USAGE: node search [EXT] [TEXT]");


var y = traverseDirectory(__dirname, function (err, result) {
	if (err) {
		console.log(err);
	}



});

function checkFilesCount() {
	//if no files were found though we did try and search
	if (filesCount == 0 && process.argv[2] != undefined) {

		console.log("no files found");

	}

}



setTimeout(function () { checkFilesCount(); }, 200);
