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

async function runPythonScript(file_name){
	let path = "public/uploaded/" + file_name;
	// const pythonProcess = execSync(`python python/test.py ${path}`) // to return output by console pythonProcess.toString()
	// execSync(`python python/test.py ${path}`) // to return output by console pythonProcess.toString()
	spawn("python", ["python/test.py", "public/uploaded/" + file_name])
	.on('exit', function (code, signal) {
		console.log('child process exited with ' + `code ${code} and signal ${signal}`);
		fs.writeFileSync("public/process_status/" + file_name, "completed")
	})
	.on('error', function (err) {
		console.log('Failed to start child process.');
		fs.writeFileSync("public/process_status/" + file_name, "error")
	});
	console.log("completed");
	// const output = fs.readFileSync(path, "utf8")
	// fs.unlinkSync(path) // to delete file after work is done
}

export default function Script(request, response) {
	if (request.method == "POST" || request.method == "PUT") {
			// console.log(request.body);
			upload.single("bib-file")(request, response, (result) => {
				if (result instanceof Error) {
					return console.log(result);
				}

				var fileData = request.file.buffer.toString();
				// console.log(fileData)
				
				// try{
					// save data into a file filename: file_time_random.txt
					let ms = new Date().getTime()
					let file_name = "file_" + ms + "_" + generateString(5) + ".txt"
					fs.writeFileSync("public/uploaded/" + file_name, fileData)
					fs.writeFileSync("public/process_status/" + file_name, "processing")

					console.log("processing started");
					runPythonScript(file_name)
					// .then(res => {
					// 	console.log(res)
					// 	console.log("completed after promise");
					// })
					// .catch(err => {
					// 	console.log("Error from async function");
					// 	console.log(err)
					// })

					console.log("file saved");

					return response.json({ file_name })
				// }
				// catch (err) {
				// 	console.log(err);
				// 	response.send({err})
				// }
				
			});
	}
}
