import fs from 'fs'


export default async function Script(request, response) {
	let myfiles = JSON.parse(request.body).files

    let data = []
    console.log(typeof(myfiles));
    for (let i = 0; myfiles && i < myfiles.length; i++) {
        let status = fs.readFileSync("public/process_status/" + myfiles[i], "utf8")

        data.push({
            "status": status,
            "filename": myfiles[i]
        })
    }

    return response.json(data)
}
