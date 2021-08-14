import React from 'react'

import moment from 'moment'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

import { IPersediaanReport } from '../../../../interfaces/reports/PersediaanReport'
import { persediaanReportDefaultObject } from '../../../../constants/adminConfigDefaultValues'
import { isToday } from 'date-fns'

export default function FormPersediaanBBM() {

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const { auth, axios } = useAuth()
    const { configs, setConfig } = useAdminConfig()

    const [report, setReport] = React.useState<IPersediaanReport>(persediaanReportDefaultObject)
    const [date, setDate] = React.useState(new Date())
    const [isEditable, setEditable] = React.useState(false)

    React.useEffect(() => {
        if (!(configs.persediaanReport?.tankId! > 0)){
            history.replace('./')
            return
        }
        setReport(configs.persediaanReport!)
        setDate(configs.persediaanReportDate!)
        setEditable(isToday(configs.persediaanReportDate!) || !(configs.persediaanReport?.id !== -1))
    }, [])

    const handleActualStockChange = (volume: number) => {
        setReport(prev => ({
            ...prev,
            actualStock: volume,
        }))
    }

    const handleSubmit = () => {
        axios({
            url: '/admin/persediaanReport/submitReport',
            method: 'post',
            data: {
                tankId: report.tankId,
                actualStock: report.actualStock,
                date: moment(date).format('D-M-YYYY')
            }
        })
        .then(() => { //handle success response
            enqueueSnackbar('Laporan berhasil dikirim')
            history.goBack()
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
        })
        .finally(() => {
            //
        })
    }

    const handleBack = () => {
        history.goBack()
    }

    return (
        <div className="tw-flex tw-flex-col">
            <p>Pelapor: <b>{report.reporter || auth.name || ''}</b></p>
            <p>Hari, Tanggal: {moment(date).locale('id').format('dddd, LL')}</p>
            <p>Nama Tangki: {report.tankName}</p>
            <p>Produk: {report.product}</p>
            <hr />
            <p>Stok awal: {report.initialStock}</p>
            <h3 className="tw-font-semibold">Penerimaan</h3>
            {
                report.penerimaan ? <>
                    <p>No. Mobil Tangki: {report.penerimaan.truckId}</p>
                    <p>No. PNBP: {report.penerimaan.pnbp}</p>
                    <p>Volume sebelum penerimaan: {report.penerimaan.initialVolume} L</p>
                    <p>Volume Penerimaan PNBP: {report.penerimaan.pnbpVolume} L</p>
                    <p>Volume Penerimaan aktual: {report.penerimaan.actualVolume} L</p>
                    <p>Selisih volume: {report.penerimaan.volumeDiff} L</p>
                </> : <p>Tidak ada penerimaan</p>
            }
            <hr />
            <h3 className="tw-font-semibold">Pengeluaran</h3>
            <p>Pengeluaran dispenser: {report.volumeOut} L</p>
            <p>Stok akhir teoritis: {report.theoriticalStock}</p>
            <p>Stok akhir aktual:</p>
            {
                isEditable ? <input type="number" value={report.actualStock ? report.actualStock : ''} onChange={(e) => handleActualStockChange(+e.target.value)} className="tw-border tw-border-black tw-py-2 tw-px-1" />
                : <span>{report.actualStock}</span>
            }
            <p>Selisih total pengeluaran: {report.actualStock - report.theoriticalStock}</p>

            {
                isEditable ? <>
                    <button className="tw-border tw-border-black tw-py-2" onClick={handleBack}>Batal</button>
                    <button className="tw-border tw-border-black tw-py-2" onClick={handleSubmit}>Simpan</button>
                </>
                : <button className="tw-border tw-border-black tw-py-2" onClick={handleBack}>Kembali</button>
            }
        </div>
    )
}
