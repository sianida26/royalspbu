import React from 'react'

import moment from 'moment'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'

import { isToday } from 'date-fns'
import PersediaanReport from '../../../../models/PersediaanReport'
import {numberWithCommas} from '../../../../utils/helper'

export default function FormPersediaanBBM() {

    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const { auth, axios } = useAuth()
    const { configs } = useAdminConfig()

    const [report, setReport] = React.useState<PersediaanReport>(new PersediaanReport())
    const [actualStock, setActualStock] = React.useState(0)
    const [inputError, setInputError] = React.useState('')
    const [date, setDate] = React.useState(new Date())
    const [isEditable, setEditable] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (configs.persediaanReport.isNotDefined()){
            history.replace('./')
            return
        }
        setReport(configs.persediaanReport)
        setActualStock(configs.persediaanReport.actualStock)
        setDate(configs.persediaanReportDate!)
        setEditable(isToday(configs.persediaanReportDate) || !(configs.persediaanReport.id !== -1))
    }, [])

    const handleActualStockChange = (volume: number) => {
        setActualStock(volume)
    }

    const handleSubmit = () => {
        if(actualStock === 0){ //TODO ganti validasi yang lebih baik
            setInputError('Harus diisi')
            return
        }
        setLoading(true)
        axios({
            url: '/admin/persediaanReport/submitReport',
            method: 'post',
            data: {
                tankId: report.tank.id,
                actualStock: actualStock,
                date: moment(date).format('D-M-YYYY')
            }
        })
        .then(() => { //handle success response
            enqueueSnackbar('Laporan berhasil dikirim', {variant: 'success'})
            history.goBack()
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.request){
                //Request was made but no response was received
            } else if (error.response){
                //Error caused from the server
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
            setLoading(false)
        })
    }

    const handleBack = () => {
        history.goBack()
    }

    return (
        <div className="tw-flex tw-flex-col tw-bg-gray-50">
            <AdminHeaderSidebar title="Catatan Persediaan BBM" />

            <div className="tw-mt-4 tw-px-4">
                <p>Pelapor: <b>{report.reporter || auth.name || ''}</b></p>
                <p>Hari, Tanggal: <b>{moment(date).locale('id').format('dddd, LL')}</b></p>
                <p>Nama Tangki: <b>{report.tankName}</b></p>
                <p>Produk: <b>{report.product}</b></p>
            </div>

            <div className="tw-w-full tw-px-4 tw-mt-4">

                {/* card */}
                <div className="tw-flex tw-flex-col tw-gap-2 tw-divide-y tw-divide-gray-300 tw-rounded-lg tw-border-gray-100 tw-border" style={{boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.25)'}}>

                    {/* stock awal */}
                    <div className="tw-px-4 tw-flex tw-justify-between tw-pt-4 tw-pb-2">
                        <p className="tw-font-medium tw-text-lg">Stok Awal</p>
                        <p className="tw-text-gray-500 tw-text-lg tw-font-medium">{numberWithCommas(report.initialStock)} L</p>
                    </div>

                    {/* Penerimaan */}
                    <div className="tw-px-4 tw-flex tw-flex-col tw-py-2">
                        <h3 className="tw-font-medium tw-text-lg">Penerimaan</h3>
                        {
                            report.penerimaan?.isDefined() ? <div className="tw-flex-col tw-mt-2">
                                {
                                    [
                                        ['No. Mobil Tangki', report.penerimaan.truckId],
                                        ['No. PNBP', report.penerimaan.pnbp],
                                        ['Volume sebelum penerimaan', `${numberWithCommas(report.penerimaan.initialVolume)} L`],
                                        ['Volume penerimaan PNBP', `${numberWithCommas(report.penerimaan.pnbpVolume)} L`],
                                        ['Volume penerimaan aktual', `${numberWithCommas(report.penerimaan.actualVolume)} L`],
                                        ['Selisih volume', `${numberWithCommas(report.penerimaan.getVolumeDiff())} L`]
                                    ].map((item, i) => <div key={i} className="tw-flex tw-w-full tw-justify-between tw-items-center tw-gap-1">
                                        <p className="">{item[0]}</p>
                                        <p className="tw-font-medium tw-text-gray-500 tw-w-20 tw-flex-shrink-0 tw-text-right">{item[1]}</p>
                                    </div>)
                                }
                            </div>
                            : <p className="tw-mt-2 tw-text-center tw-text-gray-800 tw-italic">Tidak ada penerimaan</p>
                        }
                    </div>

                    {/* Pengeluaran */}
                    <div className="tw-px-4 tw-flex tw-flex-col tw-py-2">
                        <h3 className="tw-font-medium tw-text-lg">Pengeluaran</h3>
                        <div className="tw-flex-col tw-mt-2">

                            {/* Pengeluaran dispenser */}
                            <div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-gap-1">
                                <p className="">Pengeluaran Dispenser</p>
                                <p className="tw-font-medium tw-text-gray-500 tw-w-20 tw-flex-shrink-0 tw-text-right">{numberWithCommas(report.tank.volumeOut)} L</p>
                            </div>

                            {/* Stok akhir teoritis */}
                            <div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-gap-1">
                                <p className="">Stok akhir teoritis</p>
                                <p className="tw-font-medium tw-text-gray-500 tw-w-20 tw-flex-shrink-0 tw-text-right">{numberWithCommas(report.theoriticalStock)} L</p>
                            </div>

                            {/* Stok akhir aktual */}
                            <div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-gap-1">
                                <p className="">Stok akhir aktual</p>
                                <div className="tw-w-20 tw-flex-shrink-0">
                                    {
                                        isEditable ? <div>
                                            <input 
                                                autoFocus
                                                type="number"
                                                disabled={loading}
                                                value={actualStock || ''}
                                                onChange={(e) => handleActualStockChange(+e.target.value)}
                                                className={`tw-border ${inputError ? 'tw-border-red-500 tw-ring-2 tw-ring-red-500' : 'tw-border-gray-500'} ${loading && 'tw-opacity-75'} tw-py-1 tw-rounded-md tw-px-1 tw-min-w-0 tw-w-20`}
                                            />
                                            <p className="tw-text-red-500 tw-font-medium">{inputError}</p>
                                        </div> : <p className="tw-text-right tw-font-medium tw-text-gray-500">{numberWithCommas(actualStock)} L</p>
                                    }
                                </div>
                            </div>

                            {/* Selisih total pengeluaran */}
                            <div className="tw-flex tw-w-full tw-justify-between tw-items-center tw-gap-1">
                                <p className="">Selisih total pengeluaran</p>
                                <p className="tw-font-medium tw-text-gray-500 tw-w-20 tw-flex-shrink-0 tw-text-right">{numberWithCommas(actualStock - report.theoriticalStock)} L</p>
                            </div>
                        </div>
                    </div>

                    {
                        isEditable ? <>
                            <button className="tw-border tw-border-black tw-py-2" onClick={handleBack}>Batal</button>
                            <button className="tw-border tw-border-black tw-py-2" onClick={handleSubmit}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
                        </>
                        : <button className="tw-border tw-border-black tw-py-2" onClick={handleBack}>Kembali</button>
                    }
                </div>
            </div>
        </div>
    )
}
