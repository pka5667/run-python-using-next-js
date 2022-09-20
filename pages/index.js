import React, { useState, useEffect } from 'react'
import { Button, DialogContent, Dialog, DialogTitle } from "@material-ui/core"
import { setCookie, getCookie, hasCookie } from 'cookies-next';


export default function Python() {
    const [file, setFile] = useState(null);
    const [pythonScript, setPythonScript] = useState(undefined);
    const [loading, setLoading] = useState(false)

    // const saveFile = async (blob) => {
    //     const a = document.createElement('a');
    //     a.download = 'output.txt';
    //     a.href = URL.createObjectURL(blob);
    //     a.addEventListener('click', (e) => {
    //       setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    //     });
    //     a.click();
    //   };
      

    const handleChange = (e) => {
        setFile(e.target.files[0])
      }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(pythonScript === undefined) {
            alert("Please select a python script");
            return;
        }

        if(file === null) {
            alert("Please select a file");
            return;
        }

        setLoading(true)
        let data = new FormData()
        data.append("bib-file", file)
        data.append("python_script", pythonScript)

        try {
            let res = await fetch("/api/run_python_script/script", { method: "POST", body: data })
            res = await res.json()
            console.log(res)

            // save the result
            // var blob = new Blob([res['output']], { type: "text/plain;charset=utf-8" });
            // saveFile(blob);

            // add the file name in cookies of user
            let myfiles = getCookie("myfiles")
            if (myfiles == null) {
                myfiles = []
            }
            else {
                myfiles = JSON.parse(myfiles)
            }
            myfiles.push(res['file_name'])
            setCookie("myfiles", JSON.stringify(myfiles))
            
            // redirect to next page
            setLoading(false)
            window.location.href = "/myprocess"
        } catch (err) {
            console.log(err)
        }
    }

    const handleScriptChange = (e) => {
        setPythonScript(e.target.value)
        console.log(e.target.value);
    }

    return (
        <center>
            <h1>Upload a file to run python script</h1>
            <h2>Script will convert all data in file to uppercase</h2>
            <form onSubmit={handleSubmit}>
                <select name="python_script" id="python_script" style={{marginRight: "10px"}} onChange={handleScriptChange}>
                  <option value={undefined} selected>Select Python Script</option>
                  <option value="test">test</option>
                  <option value="test1">test1</option>
                  <option value="test2">test2</option>
                </select>

                <input type="file" accept='.txt' onChange={handleChange} name="input_file"/>
                <label>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        Upload
                    </Button>
                </label>
            </form>
        </center>
      )
}
