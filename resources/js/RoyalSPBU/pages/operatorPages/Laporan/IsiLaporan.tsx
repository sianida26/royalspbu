import React from 'react'
import Compressor from 'compressorjs'

import {Report, UploadStatus} from '.'
import {useAuth} from '../../../providers/AuthProvider'

interface Props{
    handleSubmitIsi: (report: Report) => void,
    handleBack: () => void,
    report: Report,
}

interface Nozzle {
    id? : number,
    finalTotalizator?: number,
    imageUrl? : string,
    initialTotalizator? : number,
    price? : number,
    productName? : string,
    reportFilename? : string,
    uploadErrorMsg? : string,
    uploadProgress? : number,
    uploadStatus? : UploadStatus,
}

export default function IsiLaporan({report, handleSubmitIsi, handleBack}: Props) {

    const {axios} = useAuth()
    const [pump, setPump] = React.useState<Report>(report)

    React.useEffect(() => {
        setPump(report)
    },[])

    const setNozzleData = (id: number, data: Nozzle) => {

        let nozzle = pump.nozzles.find((nozzle) => nozzle.id === id )
        if (nozzle){

            let newData = {
                ...nozzle,
                ...data
            }
            
            setPump(prev => ({
                ...prev,
                nozzles: [
                    ...prev.nozzles.filter((nozzle) => nozzle.id !== id),
                    newData,
                ]
            }))
        }
        else console.log(`Failed to updating nozzle data with id ${id}`)
    }

    const handleInputTotalizator = (value: string, id: number) => {
        // setPump(prev => prev.setNozzleData(id, {finalTotalizator: +value}))
        setNozzleData(id, {finalTotalizator: +value})
    }

    const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {

        if (event.target.files && event.target.files[0]){

            // setPump(prev => prev.setNozzleData(id, {
            //     uploadErrorMsg: '',
            //     imageUrl: URL.createObjectURL(event.target.files![0]),
            //     uploadStatus: UploadStatus.COMPRESSING,
            //     uploadProgress: 0,
            // }))
            let url = URL.createObjectURL(event.target.files![0])
            console.log(url)
            setNozzleData(id, {
                imageUrl: url,
                uploadErrorMsg: '',
                uploadStatus: UploadStatus.COMPRESSING,
                uploadProgress: 0,
            })

            new Compressor(event.target.files[0],{
                quality: 0.6,
                success(result){

                    const formData = new FormData()

                    formData.append('image',result, 'image.jpeg')
                    setNozzleData(id,{
                        imageUrl: url,
                        uploadStatus: UploadStatus.UPLOADING,
                        uploadProgress: 0
                    })

                    axios({
                        method: 'post', 
                        url: '/uploadBuktiTotalizer', 
                        data: formData, 
                        onUploadProgress: (progressEvent) => {
                            console.log(progressEvent)
                            console.log('progressEvent')
                            setNozzleData(id,{
                                imageUrl: url,
                                uploadStatus: UploadStatus.UPLOADING,
                                uploadProgress: (progressEvent.loaded/progressEvent.total)*100,
                            })
                        }
                    })
                    .then(response => {
                        console.log(response)
                        // setPump(prev => prev.setNozzleData(id,{
                        //     uploadStatus: UploadStatus.UPLOADED,
                        //     uploadProgress: -1,
                        //     reportFilename: response.data
                        // }))
                        setNozzleData(id,{
                            imageUrl: url,
                            uploadStatus: UploadStatus.UPLOADED,
                            uploadProgress: -1,
                            reportFilename: response.data
                        })
                    })
                    .catch(err => {
                        // setPump(prev => prev.setNozzleData(id, {
                        //     uploadStatus: UploadStatus.ERROR,
                        //     uploadProgress: -1,
                        //     uploadErrorMsg: err.response?.data?.errors?.image[0] || 'Terjadi kesalahan ketika mengirim'
                        // }))
                        setNozzleData(id, {
                            imageUrl: url,
                            uploadStatus: UploadStatus.ERROR,
                            uploadProgress: -1,
                            uploadErrorMsg: err.response?.data?.errors?.image[0] || 'Terjadi kesalahan ketika mengirim'
                        })
                        console.log(err.response)
                    })
                },
                error(error){
                    console.log(error.message)
                    //add error message for this file
                    // setPump(prev => prev.setNozzleData(id, {
                    //     uploadStatus: UploadStatus.ERROR,
                    //     uploadProgress: -1,
                    //     uploadErrorMsg: 'File tidak bisa diproses',
                    // }))
                    setNozzleData(id, {
                        imageUrl: url,
                        uploadStatus: UploadStatus.ERROR,
                        uploadProgress: -1,
                        uploadErrorMsg: 'File tidak bisa diproses',
                    })
                }
            })
        }
    }
    
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            {report.nozzles.map((_nozzle, i) => 
                {
                    let nozzle = pump.nozzles.find(x => x.id === _nozzle.id)!
                    return (<div key={nozzle.id}>
                        <p className="tw-font-bold">Nozzle {i+1}</p>
                        <p>Nama Produk: {nozzle.productName}</p>
                        <p>Totalisator Akhir</p>
                        <input type="number" value={nozzle.finalTotalizator || ''} onChange={(e) => handleInputTotalizator(e.target.value, nozzle.id)} className="tw-border tw-border-black tw-p-2" />
                        <img src={nozzle.imageUrl} />
                        <input type="file" accept="images/*" onChange={(event) => handleChooseImage(event,nozzle.id)} />
                        {
                            nozzle.uploadProgress >= 0 && (
                                <div className="tw-flex tw-flex-col tw-w-full">
                                    <progress value={nozzle.uploadProgress} max={100}>{nozzle.uploadProgress}%</progress>
                                    <p className="">{
                                        nozzle.uploadStatus === UploadStatus.COMPRESSING ? 'Mengompres...'
                                        : 'Mengupload...'
                                    }</p>
                                </div>
                            )
                        }
                        <p className="tw-text-red-500">{nozzle.uploadErrorMsg}</p>

                    </div>)
                })
            }
            <button className="tw-border tw-bg-gray-400 mb-2" onClick={() => handleBack()}>Kembali</button>
            <button className="tw-border tw-bg-gray-400" onClick={() => handleSubmitIsi(pump)}>Selanjutnya</button>
        </div>
    )
}
