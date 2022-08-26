import multer from "multer";
import fs from 'fs'
import { execSync } from "child_process";

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


export default async function (request, response) {
	if (request.method == "POST" || request.method == "PUT") {
			// console.log(request.body);
			upload.single("bib-file")(request, response, async (result) => {
				if (result instanceof Error) {
					return console.log(result);
				}

				var fileData = request.file.buffer.toString();
				// console.log(fileData)
				
				try{
					// save data into a file filename: file_time_random.txt
					let ms = new Date()
					ms = ms.getMilliseconds();
					// var path = "python/uploaded/file_" + ms + "_" + generateString(5) + ".txt"
					var path = "python/file_" + ms + "_" + generateString(5) + ".txt"
					fs.writeFileSync(path, fileData)
					
					const pythonProcess = execSync(`python python/test.py ${path}`) // to return output by console pythonProcess.toString()
					const output = fs.readFileSync(path, "utf8")
					fs.unlinkSync(path) // to delete file after work is done
					return response.json({ output });
				}
				catch (err) {
					// console.log(err);
					response.send({"ok":"ok"})
				}
				
			});
	}
}
