import React, {useEffect, useState} from 'react'
import { getCookie, hasCookie } from 'cookies-next'

export default function Myprocess() {
    const [data, setData] = useState([])

    useEffect(() => {
        if (!hasCookie("myfiles")) {
            alert("You have not uploaded any file yet")
            window.location.href = "/"
        }

        fetch("/api/get_myfiles", { 
            method: "POST", 
            body: JSON.stringify({ "files": JSON.parse(getCookie("myfiles")) }) 
        })
        .then(res => res.json())
        .then(res => {
            setData(res)
        })
    }, [])
    
  return (
    <center>
        <table>
            {/* <th>
                <td>File Name</td>
                <td>Status</td>
            </th> */}
            {data.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.filename}</td>
                            <td>
                                <a href={`/uploaded/${item.filename}`} download style={item.status ? {color:"blue"} : null}>{item.status == "completed"? "Download Now" : item.status}</a>
                            </td>
                        </tr>
                    )
                })}
        </table>
    </center>
  )
}
