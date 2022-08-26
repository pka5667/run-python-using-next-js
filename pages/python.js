import React, { useState, useEffect } from 'react'
import { Button, DialogContent, Dialog, DialogTitle } from "@material-ui/core"


export default function Python() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

    const saveFile = async (blob) => {
        const a = document.createElement('a');
        a.download = 'output.txt';
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', (e) => {
          setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
      };
      

    const handleChange = (e) => {
        setFile(e.target.files[0])
      }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // console.log(file)
        let data = new FormData()
        data.append("bib-file", file)

        try {
            let res = await fetch("/api/run_python_script/script", { method: "POST", body: data })
            res = await res.json()
            // console.log(res)

            // save the result
            var blob = new Blob([res['output']], { type: "text/plain;charset=utf-8" });
            saveFile(blob);

            setLoading(false)
            setModal(false)
        } catch (err) {
            // console.log(err)
        }
    }

    return (
        <center>
            <h1>Upload a file to run python script</h1>
            <h2>Script will convert all data in file to uppercase</h2>
            <form onSubmit={handleSubmit}>
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
