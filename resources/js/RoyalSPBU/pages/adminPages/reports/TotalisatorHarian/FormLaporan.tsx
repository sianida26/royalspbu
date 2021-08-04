import React from 'react'

import Compressor from 'compressorjs'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import {useHistory} from 'react-router-dom'
import * as uuid from 'uuid'

import ModalPengeluaran from '../../../../components/modals/ModalPengeluaran'
import {useAuth} from '../../../../providers/AuthProvider'

import 'moment/locale/id'

interface Pengeluaran {
    id: number | string, //if string (uuid), new item. if number, old item
    pengeluaran: string,
    amount: number,
    fileName: string,
}

interface Penerimaan {
    tankName: string,
    volume: number,
}

interface Penjualan {
    tankName: string,
    volume: number,
    price: number,
    income: number,
}

interface ReportData {
    penerimaan: Penerimaan[],
    penjualan: Penjualan[],
    totalIncome: number,
}

const defaultModalData: Pengeluaran = {
    id: -1,
    pengeluaran: '',
    amount: 0,
    fileName: '',
}

export default function FormLaporan() {

    const history = useHistory()
    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()

    const [isRequestingData, setRequestingData] = React.useState(true)
    const [isModalShow, setModalShow] = React.useState(false)
    const [pengeluarans, setPengeluarans] = React.useState<Pengeluaran[]>([])
    const [modalData, setModalData] = React.useState<Pengeluaran>(defaultModalData)
    const [savings, setSavings] = React.useState(0)
    const [isUploading, setUploading] = React.useState(false)
    const [uploadError, setUploadError] = React.useState('')
    const [isUploadSuccess, setUploadSuccess] = React.useState(false)
    const [savingsFileName, setSavingsFileName] = React.useState('')
    const [penerimaans, setPenerimaans] = React.useState<Penerimaan[]>([])
    const [penjualans, setPenjualans] = React.useState<Penjualan[]>([])
    const [totalIncome, setTotalIncome] = React.useState(0)
    const [isSubmitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        requestReportData()
    }, [])

    const requestReportData = () => {
        setRequestingData(true)
        axios({
            method: 'post',
            url: '/admin/totalizatorReport/getFormReportData',
            data: {
                date: moment().format('D-M-YYYY'),
            }
        })
        .then(result => { //handle success response
            let data: ReportData = result.data;
            console.log(data) //todo remove log
            setPenerimaans(data.penerimaan)
            setPenjualans(data.penjualan)
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
        setModalShow(false)
        setModalData(defaultModalData) //reset modal data
    }

    const handleAddPengeluaran = (pengeluaran: string, amount: number, fileName: string) => {
        setPengeluarans([
            ...pengeluarans,
            {id: uuid.v1(),pengeluaran, amount, fileName}
        ])
        handleCloseModal()
    }

    const handleEditClick = (pengeluaran: Pengeluaran) => {
        setModalData(pengeluaran)
        setModalShow(true)
    }

    const handleDeleteClick = (pengeluaran: Pengeluaran) => {
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
            url: '/admin/totalizatorReport/submit',
            data: {
                date: moment().format('D-M-YYYY'),
                pengeluaran: pengeluarans,
                tabungan: {
                    amount: savings,
                    fileName: savingsFileName,
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
            setSavingsFileName(data)
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
            <span>Pelapor: <span className="tw-font-semibold">Fulan bin Anonim</span></span>
            <span>Hari, Tanggal: <span className="tw-font-semibold">{moment().locale('id').format('dddd, LL')}</span></span>
            <h1 className="tw-font-bold tw-text-lg text-center">Penerimaan BBM</h1>
            {
                penerimaans.map(penerimaan => <p>{penerimaan.tankName}: {penerimaan.volume || '-'}</p>)
            }
            <h1 className="tw-font-bold tw-text-lg text-center">Penjualan</h1>
            {
                penjualans.map(penjualan => <div>
                    <h2 className="tw-font-semibold tw-text-md">{penjualan.tankName}</h2>
                    <div className="tw-flex tw-justify-between">
                        <span>Harga per liter</span>
                        <span>Rp{penjualan.price}</span>
                    </div>
                    <div className="tw-flex tw-justify-between">
                        <span>Volume Penjualan</span>
                        <span>{penjualan.volume} L</span>
                    </div>
                    <div className="tw-flex tw-justify-between">
                        <span>Total Penjualan</span>
                        <span>Rp{penjualan.income}</span>
                    </div>
                </div>)
            }
            <h1 className="tw-font-bold tw-text-lg text-center">Total Penjualan Kotor</h1>
            {
                penjualans.map(penjualan => <p>{penjualan.tankName}: Rp{penjualan.income}</p>)
            }
            <h2 className="tw-font-semibold tw-text-md">Total Penjualan Kotor</h2>
            <h2 className="tw-font-semibold tw-text-md">Rp{totalIncome}</h2>
            <h1 className="tw-font-bold tw-text-lg tw-text-center">Biaya Pengeluaran</h1>
            {
                pengeluarans.length > 0 ? <div>{pengeluarans.map((pengeluaran, i) => (
                        <div key={pengeluaran.id} className="tw-w-full tw-border tw-border-black tw-flex tw-flex-col tw-gap-2">
                            <span>{i+1}</span>
                            <span>{pengeluaran.pengeluaran}</span>
                            <span>{pengeluaran.amount}</span>
                            <span onClick={() => handleDeleteClick(pengeluaran)}>Hapus</span>
                            <span onClick={() => handleEditClick(pengeluaran)}>Edit</span>
                        </div>
                    ))}
                    <hr />
                    <span className="">Total Biaya: {pengeluarans.reduce((accumulator, pengeluaran) => accumulator+pengeluaran.amount,0)}</span>
                </div>
                : <span>Tidak ada pengeluaran</span>
            }
            <button className="tw-w-full tw-border tw-border-black tw-py-2" onClick={() => {setModalShow(true)}}>Tambah</button>
            <ModalPengeluaran show={isModalShow} closeModal={handleCloseModal} onSubmit={handleAddPengeluaran} data={modalData}  />

            <h1 className="tw-font-bold tw-text-lg tw-text-center">Tabungan</h1>
            <span>Nominal</span>
            <input className="tw-border tw-border-black" type="number" min="0" value={savings || ''} onChange={(e) => setSavings(+e.target.value)} />
            <p>Bukti Pembayaran</p>
            {
                savingsFileName && <img src={`/storage/temp/${savingsFileName}`} alt="Bukti Struk" className=""></img>
            }
            <input accept="image/*" className="tw-hidden" id="button-upload-savings" type="file" onChange={e => handleChooseImage(e)} disabled={isUploading} />
            <label htmlFor="button-upload-savings">
                {
                    isUploading ? <div className="tw-flex items-center">
                        <span className="tw-ml-3">Mengupload...</span>
                    </div>
                    : <span className="tw-border tw-border-black tw-bg-purple-500">
                        Ambil Gambar
                    </span>
                }
            </label>

            <h1 className="tw-font-bold tw-text-lg tw-text-center">Total Penjualan Bersih</h1>
            <span>Total Penjualan Kotor: Rp{totalIncome}</span>
            <span>Total Biaya: Rp{pengeluarans.reduce((accumulator,pengeluaran) => accumulator+pengeluaran.amount,0)}</span>
            <span>Total Penjualan Bersih: Rp{totalIncome - pengeluarans.reduce((accumulator,pengeluaran) => accumulator+pengeluaran.amount,0)}</span>
            <button className="tw-border tw-border-black">Batal</button>
            <button className="tw-border tw-border-black" onClick={handleSubmit}>Simpan</button>
        </div>
    )
}
