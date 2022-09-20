import multer from "multer";
import fs from 'fs'
import { execSync, spawn, exec } from "child_process";

export const config = {
	api: {
		bodyParser: false,
	},
};

const upload = multer();


function generateString(length) {
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


async function runPythonScript(file_name, script_name){
	let path = "public/uploaded/" + file_name;

	spawn("python", ["python/" + script_name + ".py", path])
	.on('exit', function (code, signal) {
		console.log('child process exited with ' + `code ${code} and signal ${signal}`);
		fs.writeFileSync("public/process_status/" + file_name, "completed")
	})
	.on('error', function (err) {
		console.log('Failed to start child process.');
		fs.writeFileSync("public/process_status/" + file_name, "error")
	});
	console.log("completed");
}


export default function Script(request, response) {
	if (request.method == "POST" || request.method == "PUT") {
			// console.log(request.body);
			upload.single("bib-file")(request, response, (result) => {
				if (result instanceof Error) {
					return console.log(result);
				}

				var fileData = request.file.buffer.toString();
				var script_name = request.body.python_script;
				
				// save data into a file filename: file_time_random.txt
				let ms = new Date().getTime()
				let file_name = "file_" + ms + "_" + generateString(5) + ".txt"
				fs.writeFileSync("public/uploaded/" + file_name, fileData)
				fs.writeFileSync("public/process_status/" + file_name, "processing")

				runPythonScript(file_name, script_name)

				return response.json({ file_name })
			});
	}
}
