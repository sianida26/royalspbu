import React from 'react'

import Compressor from 'compressorjs'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import {useHistory} from 'react-router-dom'

import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'

import ModalPengeluaran from '../../../../components/modals/ModalPengeluaran'
import {numberWithCommas, formatRupiah} from '../../../../utils/helper'
import {useAuth} from '../../../../providers/AuthProvider'
import { editTotalisatorReportDefaultObject, useAdminConfig } from '../../../../providers/AdminConfigProvider'

import 'moment/locale/id'
import Penjualan from '../../../../models/Penjualan'
import Penerimaan from '../../../../models/Penerimaan'
import {UploadStatus} from '../../../../models/Tabungan'
import TotalizatorReport from '../../../../models/TotalizatorReport'

import {
    TextField,
    InputAdornment,
} from '@material-ui/core'

interface PengeluaranData {
    id: number | string, //if string (uuid), new item. if number, old item
    name: string,
    amount: number,
    url: string,
    reportFilename: string | null,
}

interface ReportServerResponse {
    penerimaan: {
        tankName: string,
        volume: number,
    }[],
    penjualan: {
        tankName: string,
        volume: number,
        price: number,
        income: number,
    }[],
    totalIncome: number,
}

interface ModalOptions{
    show: boolean,
    isEdit: boolean,
}

const defaultModalData: PengeluaranData = {
    id: '',
    name: '',
    amount: 0,
    url: '',
    reportFilename: '',
}

const defaultModalOptions: ModalOptions = {
    show: false,
    isEdit: false,
}

export default function FormLaporan() {

    const isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    
    const history = useHistory()
    const {axios} = useAuth()
    const { enqueueSnackbar } = useSnackbar()
    const { configs, setConfig } = useAdminConfig()

    const [isRequestingData, setRequestingData] = React.useState(true)
    const [modalOptions, setModalOptions] = React.useState<ModalOptions>(defaultModalOptions)
    const [pengeluarans, setPengeluarans] = React.useState<PengeluaranData[]>([])
    const [modalData, setModalData] = React.useState<PengeluaranData>(defaultModalData)
    const [savings, setSavings] = React.useState(0)
    const [isUploading, setUploading] = React.useState(false)
    const [uploadStatus, setUploadStatus] = React.useState(UploadStatus.NONE)
    const [uploadError, setUploadError] = React.useState('')
    const [isUploadSuccess, setUploadSuccess] = React.useState(false)
    const [savingsFileUrl, setSavingsFileUrl] = React.useState('')
    const [penerimaans, setPenerimaans] = React.useState<Penerimaan[]>([])
    const [penjualans, setPenjualans] = React.useState<Penjualan[]>([])
    const [totalIncome, setTotalIncome] = React.useState(0)
    const [isSubmitting, setSubmitting] = React.useState(false)
    const [date, setDate] = React.useState(new Date())

    React.useEffect(() => {
        if (isEdit){
            if (configs.editLaporanTotalisatorObject.isNotDefined()) {
                history.replace('/laporan/totalisator-harian')
                return
            }
            setDate(configs.editLaporanTotalisatorObject.date)
            setPengeluarans(configs.editLaporanTotalisatorObject.pengeluarans.map(pengeluaran => {

                return {
                    id: pengeluaran.id,
                    amount: pengeluaran.amount,
                    name: pengeluaran.name,
                    reportFilename: pengeluaran.reportFilename,
                    url: `/storage/images/receipts/pengeluaran/${pengeluaran.reportFilename}`
                }
            }))
            setSavings(configs.editLaporanTotalisatorObject.tabungan?.amount || 0)
            if (configs.editLaporanTotalisatorObject.tabungan?.reportFilename){
                setSavingsFileUrl(`/storage/images/receipts/tabungan/${configs.editLaporanTotalisatorObject?.tabungan?.reportFilename}`)
            }
            setConfig({editLaporanTotalisatorObject: new TotalizatorReport()}) //reset to default
        }
        setDate(configs.createLaporanTotalisatorDate)
        requestReportData()
    }, [])

    const requestReportData = () => {
        setRequestingData(true)
        let reportDate = configs.editLaporanTotalisatorObject.date || configs.createLaporanTotalisatorDate
        axios({
            method: 'post',
            url: '/admin/totalizatorReport/getFormReportData',
            data: {
                date: moment(reportDate).format('D-M-YYYY'),
            }
        })
        .then(result => { //handle success response
            let data: ReportServerResponse = result.data;
            setPenerimaans(data.penerimaan.map(penerimaan => {
                let model = new Penerimaan({
                    volume: penerimaan.volume
                })
                model.tankName = penerimaan.tankName
                return model
            }))
            setPenjualans(data.penjualan.map(penjualan => {
                let model = new Penjualan({
                    volume: penjualan.volume
                })

                model.tankName = penjualan.tankName
                model.price = penjualan.price
                return model
            }))
            setTotalIncome(data.totalIncome)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            //you can show error notification here
            if (errorMessage) enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => {
            setRequestingData(false)
        })
    }

    const handleCloseModal = () => {
        setModalOptions(defaultModalOptions)
        setModalData(defaultModalData) //reset modal data
    }

    const handleSubmitPengeluaran = (pengeluaran: string, amount: number, fileName: string, id: number|string, url: string) => {
        let submittedData = {
            id,
            name: pengeluaran, 
            amount, 
            url,
            reportFilename: fileName
        }

        if (isEdit){
            setPengeluarans(
                prev => [
                    ...prev.filter(x => x.id !== id),
                    submittedData,   
                ]
            )
        } else {
            setPengeluarans([
                ...pengeluarans,
                submittedData
            ])
        }
        
        handleCloseModal()
    }

    const handleEditClick = (pengeluaran: PengeluaranData) => {
        setModalData(pengeluaran)
        setModalOptions({
            isEdit: true,
            show: true
        })
    }

    const handleAddPengeluaranClick = () => {
        setModalOptions({
            isEdit: false,
            show: true
        })
    }

    const handleDeleteClick = (pengeluaran: PengeluaranData) => {
        setPengeluarans(pengeluarans.filter(p => p.id !== pengeluaran.id))
    }

    const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]){

            new Compressor(event.target.files[0],{
                quality: 0.6,
                success(result){
                    //on success compressing image
                    sendImage(result)
                },
                error(error){
                    //on error comporessing image
                    // setUploadError('Terjadi kesalahan ketika mengolah gambar. Silakan periksa gambar yang Anda pilih')
                }
            })
        }
    }

    const handleSubmit = () => {
        setSubmitting(true)
        axios({
            method: 'post',
            url: `/admin/totalizatorReport/${isEdit ? 'submit' : 'submit'}`, //todo
            data: {
                date: moment(date).format('D-M-YYYY'),
                pengeluaran: pengeluarans,
                tabungan: {
                    amount: savings,
                    fileName: savingsFileUrl.split('/').pop()!,
                },
            }
        })
        .then(result => { //handle success response
            let data = result.data;
            console.log(data) //todo remove log
            history.replace('/laporan/totalisator-harian')
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.request){
                //Request was made but no response was received
            } else if (error.response){
                //Error caused from the server
                console.log(error.response) //todo remove log
                let errorCode = error.response.status
                switch(errorCode){
                    case 400: /*bad request*/ break; 
                    case 401: /*Unauthorized*/ break;
                    case 403: /*Forbidden*/ break;
                    case 404: /*not found*/ break; 
                    case 405: /*method not allowed*/ break; 
                    case 408: /*Request timed out*/ break;
                    case 409: /*Conflict*/ break;
                    case 419: /*Page expired, CSRF token missing*/ break;
                    case 422: /*Validation failed*/ break;
                    case 429: /*Too Many Request */ break;
                    case (Math.floor(errorCode/100) === 5): //server error
                        errorMessage=`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Ups. terjadi error (${errorCode})`;
                }
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            //you can show error notification here
            if (errorMessage) enqueueSnackbar(errorMessage,{variant:"error"});
        });
        //TODO: lanjutkan event submit
    }

    const sendImage = (result: Blob) => {
        const formData = new FormData()
        formData.append('image',result,'image.jpeg')
        setUploading(true)
        setUploadError('')
        axios({
            method: 'post',
            url: '/admin/totalizatorReport/uploadBuktiTabungan',
            data: formData,
            onUploadProgress: (progressEvent) => console.log(progressEvent) //todo fix
        })
        .then(result => { //handle success response
            setUploadError('')
            setUploadSuccess(true)
            let data = result.data;
            setSavingsFileUrl(`/storage/temp/${data}`)
        })
        .catch(error =>{ //handle error response
            setUploadSuccess(false)
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 422: {
                        errorMessage = error.response.data.errors.image[0]
                        break;
                    }
                }
            }
            setUploadError(errorMessage)
        })
        .finally(() => {
            setUploading(false)
        })
    }

    return isRequestingData ? <span>Meminta Data....</span> : (
        <div className="tw-w-full tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Laporan Totalisator Harian" />
            <div className="tw-px-4 tw-flex tw-flex-col tw-mt-4">
                <span>Pelapor: <span className="tw-font-semibold">Fulan bin Anonim</span></span>
                <span>Hari, Tanggal: <span className="tw-font-semibold">{moment(date).locale('id').format('dddd, LL')}</span></span>

                {/* Penerimaan BBM */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Penerimaan BBM</h1>
                    {
                    //   penerimaans.map(penerimaan => <p>{penerimaan.tankName}: {penerimaan.volume || '-'}</p>)  
                      penerimaans.map((penerimaan,i) => <div key={i} className="tw-flex tw-w-full tw-border-b tw-py-2 tw-items-center">
                          <span className="tw-w-32">{penerimaan.tankName}</span>
                          <span className="tw-font-semibold tw-mr-2">:</span>
                          <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {numberWithCommas(penerimaan.volume)} L</span>
                        </div>)  
                    }
                </div>


                {/* Penjualan BBM */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Penjualan</h1>
                    {
                        penjualans.map((penjualan, i) => <div key={i} className="tw-flex tw-flex-col tw-py-2">
                            <h2 className="tw-font-semibold tw-text-lg tw-text-orange-500">{penjualan.tankName}</h2>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Harga per Liter</span>
                                <span className="tw-text-gray-500 tw-font-semibold">{formatRupiah(penjualan.price)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Volume Penjualan</span>
                                <span className="tw-text-gray-500 tw-font-semibold">{numberWithCommas(penjualan.volume)} L</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Total Penjualan</span>
                                <span className="tw-text-gray-500 tw-font-semibold">{formatRupiah(penjualan.getIncome())}</span>
                            </div>
                        </div>)
                    }
                </div>

                {/* Penjualan Kotor */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8 tw-rounded-md tw-bg-gray-100 tw-py-4 tw-px-2">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Total Penjualan Kotor</h1>
                    {
                    //   penerimaans.map(penerimaan => <p>{penerimaan.tankName}: {penerimaan.volume || '-'}</p>)  
                      penjualans.map((penjualan,i) => <div key={i} className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                          <span className="tw-w-32">{penjualan.tankName}</span>
                          <span className="tw-font-semibold tw-mr-2">:</span>
                          <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(penjualan.getIncome())} </span>
                        </div>)  
                    }

                    <div className="tw-mx-3 tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-items-center tw-mt-8">
                        <span className="tw-text-lg tw-font-medium">Total Penjualan Kotor</span>
                        <span className="tw-font-bold tw-text-orange-500 tw-text-xl">{formatRupiah(totalIncome)}</span>
                    </div>
                </div>

                {/* Biaya */}
                <div className="tw-relative tw-rounded-xl tw-border tw-border-black tw-flex tw-flex-col tw-px-2 tw-pb-3 tw-pt-6 tw-mt-8">
                    <span className="tw-absolute tw-px-2 tw-bg-white tw-text-lg tw-font-semibold tw--top-0.5 tw-left-1/2" style={{transform: 'translate(-50%, -50%)'}}>Biaya</span>
                    {
                        pengeluarans.length > 0 && <div className="tw-p-2">
                            {
                                pengeluarans.map((pengeluaran, i) => <div className="tw-border-b tw-border-gray-300 tw-py-2" key={i}>
                                    <div className="tw-flex tw-justify-between tw-py-2">
                                        <span>{i+1}. {pengeluaran.name}</span>
                                        <span>{formatRupiah(pengeluaran.amount)}</span> 
                                    </div>
                                    <div className="tw-flex tw-justify-around">
                                        <button 
                                            className="tw-rounded-xl tw-w-20 tw-bg-yellow-500 tw-text-white tw-px-2 tw-py-1 tw-justify-center tw-items-center tw-mx-auto tw-text-sm"
                                            onClick={() => handleEditClick(pengeluaran)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="tw-rounded-xl tw-w-20 tw-bg-red-500 tw-text-white tw-px-2 tw-py-1 tw-justify-center tw-items-center tw-mx-auto tw-text-sm"
                                            onClick={() => handleDeleteClick(pengeluaran)}
                                        >
                                            Hapus
                                        </button> 
                                    </div>
                                </div>)
                            }

                            <div className="tw-flex tw-justify-between tw-py-2">
                                <span>Total biaya</span>
                                <span>{formatRupiah(pengeluarans.reduce((accumulator, pengeluaran) => accumulator+pengeluaran.amount,0))}</span> 
                            </div>
                        </div>
                    }
                    <button 
                        className="btn-dense tw-bg-green-600 tw-text-white"
                        onClick={handleAddPengeluaranClick}
                    >
                        <i className="bi bi-plus" />
                        <span>Tambah</span>
                    </button>
                </div>
                <ModalPengeluaran show={modalOptions.show} isEdit={modalOptions.isEdit} closeModal={handleCloseModal} onSubmit={handleSubmitPengeluaran} data={modalData}  />

                {/* Tabungan */}
                <div className="tw-relative tw-rounded-xl tw-border tw-border-black tw-flex tw-flex-col tw-px-4 tw-pb-3 tw-pt-4 tw-mt-8">
                    <span className="tw-absolute tw-px-2 tw-bg-white tw-text-lg tw-font-semibold tw--top-0.5 tw-left-1/2" style={{transform: 'translate(-50%, -50%)'}}>Tabungan</span>

                    <TextField
                        label="Nominal"
                        type="number"
                        value={savings || ''}
                        onChange={(e) => setSavings(+e.target.value)}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                        }}
                    />

                    <div className="tw-mt-4">Bukti Foto</div>
                    <label htmlFor={`tabungan-upload-button`}>
                        {
                            savingsFileUrl ? <div className="tw-relative">
                                <img src={savingsFileUrl} alt="Bukti Laporan" className="tw-max-w-full" />
                                {
                                    (uploadStatus === UploadStatus.COMPRESSING || uploadStatus === UploadStatus.UPLOADING) && <div className="tw-absolute tw-w-full tw-h-full tw-bg-black tw-bg-opacity-75 tw-text-white tw-grid tw-place-items-center tw-top-0">
                                        <span>
                                            {
                                                uploadStatus === UploadStatus.COMPRESSING ? 'Mengompres...' : `Mengupload...`
                                            }
                                        </span>
                                    </div>
                                }
                            </div>
                            : <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-h-24 tw-bg-gray-200 tw-font-smeibold tw-text-sm">Ambil Gambar</div>
                        }
                    </label>
                    <input id={`tabungan-upload-button`} disabled={uploadStatus === UploadStatus.COMPRESSING || uploadStatus === UploadStatus.UPLOADING} hidden type="file" accept="images/*" onChange={(event) => handleChooseImage(event)} />
                </div>

                {/* Penjualan Bersih */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8 tw-rounded-md tw-bg-gray-100 tw-py-4 tw-px-2">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Total Penjualan Bersih</h1>
                    
                    <div className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                        <span className="tw-w-44">Total Penjualan Kotor</span>
                        <span className="tw-font-semibold tw-mr-2">:</span>
                        <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(totalIncome)} </span>
                    </div>

                    <div className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                        <span className="tw-w-44">Total Biaya</span>
                        <span className="tw-font-semibold tw-mr-2">:</span>
                        <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(pengeluarans.reduce((accumulator, pengeluaran) => accumulator+pengeluaran.amount,0))} </span>
                    </div>

                    <div className="tw-mx-3 tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-items-center tw-mt-8">
                        <span className="tw-text-lg tw-font-medium">Total Penjualan Bersih</span>
                        <span className="tw-font-bold tw-text-green-600 tw-text-xl">{formatRupiah(totalIncome - pengeluarans.reduce((accumulator, pengeluaran) => accumulator+pengeluaran.amount,0))}</span>
                    </div>
                </div>
            </div>

            <div className="tw-w-full tw-flex tw-py-8 tw-justify-between">

                {/* cancel button */}
                <button className="btn-dense tw-border tw-border-red-500 tw-text-red-500">
                    <i className="bi bi-x-lg" />
                    <span>Batal</span>
                </button>

                {/* save button */}
                <button 
                    className="btn-dense tw-bg-primary-500 tw-text-white"
                    onClick={handleSubmit}
                >
                    <i className="bi bi-check-lg" />
                    <span>Simpan</span>
                </button>
            </div>
        </div>
    )
}
