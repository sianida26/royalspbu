import React, {useState} from 'react'
import { ChangeEvent } from 'react'
import axios from 'axios'

export default function Upload() {

    const [file, setFile] = useState<File|null>(null)
    const [progress, setProgress] = useState(0)


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {alert('file tidak ada'); return}
        setFile(e.target.files[0])
    }

    const handleUpload = () => {
        if (file == null) return
        let formData = new FormData()
        formData.append("file",file,file.name)
        
        axios({method: 'POST', url: '/api/upload', data: formData, onUploadProgress: (progressEvent) => {
            let progress = Math.round((progressEvent.loaded * 100)/ progressEvent.total)
            setProgress(progress)
        }})
    }

    return (
        <div className="tw-flex tw-w-full tw-flex-col">
            <p>Ayo upload</p>
            <input type="file" onChange={(e) => handleFileChange(e)} />
            <button className="tw-border tw-border-black tw-rounded-lg tw-bg-green-300" onClick={handleUpload}>Gas</button>
            <span>{progress}%</span>
        </div>
    )
}
