import React from 'react'

import Compressor from 'compressorjs'

import configs from '../../../constants/configs'
import { useConfig } from '../../../providers/ConfigProvider'
import DailyPumpReport from '../../../models/DailyPumpReport'
import { UploadStatus } from '../../../models/Nozzle'
import { useAuth } from '../../../providers/AuthProvider'

interface Props{
    handleSubmitIsi: (report: DailyPumpReport) => void,
    handleBack: () => void,
    report: DailyPumpReport,
}

interface NozzleData {
    id: number,
    productName: string,
    imageUrl: string,
    reportFilename: string,
    totalizator: number,
    uploadErrorMsg: string,
    uploadStatus: UploadStatus,
    uploadProgress: number,
}

export default function IsiLaporan(props: Props) {

    const {axios} = useAuth()
    const {configs: operatorConfigs} = useConfig()
    const [nozzleData, setNozzleData] = React.useState<NozzleData[]>([])

    React.useEffect(() => {
        setNozzleData(props.report.pump.nozzles.map(nozzle => {

            return {
                id: nozzle.id || 0,
                productName: nozzle.productName,
                imageUrl: nozzle.imageUrl || '',
                reportFilename: nozzle.reportFilename || '',
                uploadErrorMsg: '',
                totalizator: nozzle.totalizator,
                uploadProgress: 0,
                uploadStatus: UploadStatus.NONE,
            }
        }))
    },[])

    const handleSubmitForm = () => {
        let report = props.report
        let isValid = true
        report.pump.nozzles = report.pump.nozzles.map((nozzle, i) => {

            //validate
            if (!nozzleData[i].imageUrl){
                setNozzleDataById(nozzle.id, {uploadErrorMsg: 'Harus mengirim bukti foto'})
                isValid = false
                return nozzle
            }

            if (nozzleData[i].totalizator === 0){ //TODO fix this if totalizator is truly 0
                setNozzleDataById(nozzle.id, {uploadErrorMsg: 'Totalizator harus diisi'})
                isValid = false
                return nozzle
            }

            if (!nozzleData[i].reportFilename){
                setNozzleDataById(nozzle.id, {uploadErrorMsg: 'Gambar belum terupload di server. Silakan coba upload lagi'})
                isValid = false
                return nozzle
            }

            if (isValid){ //clears error message
                setNozzleDataById(nozzle.id, {uploadErrorMsg: ''})
            }

            nozzle.imageUrl = nozzleData[i].imageUrl
            nozzle.reportFilename = nozzleData[i].reportFilename
            nozzle.totalizator = nozzleData[i].totalizator
            return nozzle
        })

        if (isValid){
            window.scrollTo(0, 0)
            props.handleSubmitIsi(report)
        }
    }

    const setNozzleDataById = (id: number, obj: Partial<NozzleData>) => {

        setNozzleData(prev => prev.map(nozzle => {
            if (nozzle.id !== id) return nozzle
            return {
                ...nozzle,
                ...obj,
            }
        }))
    }

    const handleInputTotalizator = (value: number, id: number) => {
        setNozzleDataById(id, {totalizator: value})
    }

    const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {

        if (event.target.files && event.target.files[0]){

            let url = URL.createObjectURL(event.target.files![0])

            setNozzleDataById(id,{
                uploadErrorMsg: '',
                imageUrl: URL.createObjectURL(event.target.files![0]),
                uploadStatus: UploadStatus.COMPRESSING,
                uploadProgress: 0,
            })
            
            new Compressor(event.target.files[0],{
                quality: 0.6,
                success(result){

                    const formData = new FormData()

                    formData.append('image',result, 'image.jpeg')
                    setNozzleDataById(id,{
                        imageUrl: url,
                        uploadStatus: UploadStatus.UPLOADING,
                        uploadProgress: 0,
                    })

                    axios({
                        method: 'post', 
                        url: '/uploadBuktiTotalizer', 
                        data: formData, 
                        onUploadProgress: (progressEvent) => {
                            setNozzleDataById(id,{
                                uploadProgress: (progressEvent.loaded/progressEvent.total)*100
                            })
                        }
                    })
                    .then(response => {
                        setNozzleDataById(id, {
                            uploadStatus: UploadStatus.UPLOADED,
                            uploadProgress: 0,
                            reportFilename: response.data,
                            uploadErrorMsg: '',
                        })
                    })
                    .catch(err => {
                        setNozzleDataById(id,{
                            uploadStatus: UploadStatus.ERROR,
                            imageUrl: '',
                            uploadProgress: 0,
                            uploadErrorMsg: err.response?.data?.errors?.image[0] || `Terjadi kesalahan ketika mengirim ${err.message}`,
                        })
                    })
                },
                error(error){
                    setNozzleDataById(id, {
                        uploadStatus: UploadStatus.ERROR,
                        uploadProgress: 0,
                        uploadErrorMsg: 'File tidak dapat diproses',
                    })
                }
            })
        }
    }
    
    return (
        <div 
            className="tw-flex tw-flex-col tw-max-w-screen-sm tw-w-full tw-items-center tw-justify-center tw-mt-2 tw-px-5 tw-py-5 tw-bg-white tw-rounded-xl tw-gap-4"
            style={{boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.25)', borderRadius: '12px'}}
        >
            <p className="tw-font-semibold tw-text-gray-500 tw-text-xl">Laporan Pulau Pompa {props.report.pump.pumpNumber}</p>
            {nozzleData.map((nozzle, i) => 
                {
                    return <div key={nozzle.id} className="tw-flex tw-flex-col tw-items-center tw-w-full tw-bg-gray-100 tw-py-4 tw-px-2 tw-rounded-lg">
                        <div className="tw-grid tw-grid-cols-7 tw-gap-2 tw-w-full tw-items-center tw-justify-center">
                            <div className="tw-col-span-3 tw-font-semibold tw-text-lg">Nozzle {i+1}</div>
                            <div className="tw-col-span-4" />
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Nama Produk</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{nozzle.productName}</div>
                            <div className="tw-col-span-4 tw-font-medium">Totalisator Akhir</div>
                            <div className="tw-relative tw-col-span-3">
                                <input 
                                    className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg focus:tw-outline-none focus:tw-border-gray-400 tw-py-1 tw-pl-2 tw-pr-7 tw-font-medium tw-max-w-full" 
                                    maxLength={6}
                                    min={0}
                                    type="number"
                                    value={nozzle.totalizator || ''}
                                    onChange={(e) => e.target.value.length <= configs.TOTALIZATOR_MAX_LENGTH && handleInputTotalizator(+e.target.value, nozzle.id)}
                                />
                                <span className="tw-absolute tw-h-full tw-right-0 tw-top-0 tw-bg-primary-600 tw-text-white tw-px-2 tw-rounded-r-lg tw-grid tw-place-items-center">
                                    <span>L</span>
                                </span>
                            </div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-w-full tw-mt-4 tw-bg-white tw-px-4 tw-py-4">
                            <div className="">Bukti Foto</div>
                            <label htmlFor={`report-upload-button-${i}`}>
                                {
                                    nozzle.imageUrl ? <div className="tw-relative">
                                        <img src={nozzle.imageUrl} alt="Bukti Laporan" className="tw-max-w-full" />
                                        {
                                            (nozzle.uploadStatus === UploadStatus.COMPRESSING || nozzle.uploadStatus === UploadStatus.UPLOADING) && <div className="tw-absolute tw-w-full tw-h-full tw-bg-black tw-bg-opacity-75 tw-text-white tw-grid tw-place-items-center tw-top-0">
                                                <span>
                                                    {
                                                        nozzle.uploadStatus === UploadStatus.COMPRESSING ? 'Mengompres...' : `Mengupload... (${nozzle.uploadProgress}%)`
                                                    }
                                                </span>
                                            </div>
                                        }
                                    </div>
                                    : <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-h-24 tw-bg-gray-200 tw-font-smeibold tw-text-sm">Ambil Gambar</div>
                                }
                            </label>
                            <input id={`report-upload-button-${i}`} disabled={nozzle.uploadStatus === UploadStatus.COMPRESSING || nozzle.uploadStatus === UploadStatus.UPLOADING} hidden type="file" accept="images/*" onChange={(event) => handleChooseImage(event, nozzle.id)} />
                            {nozzle.uploadErrorMsg && <span className="tw-text-red-500 tw-mt-2 tw-font-semibold">{nozzle.uploadErrorMsg}</span>}
                        </div>
                    </div>
                })
            }
            <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-my-10">
                {operatorConfigs.editReport.isNotDefined() && <button 
                    className="tw-border tw-border-orange-500 tw-rounded-full tw-py-1 tw-px-3 tw-text-center tw-justify-center tw-font-semibold tw-text-orange-500 focus:tw-outline-none"
                    onClick={() => props.handleBack()}
                >
                    Kembali
                </button>}
                <button 
                    className="tw-bg-primary-500 tw-border tw-border-primary-500 tw-rounded-full tw-py-1 tw-px-3 tw-text-center tw-justify-center tw-font-semibold tw-text-white focus:tw-outline-none"
                    onClick={handleSubmitForm}
                >
                    Cek
                </button>
            </div>
        </div>
    )
}
