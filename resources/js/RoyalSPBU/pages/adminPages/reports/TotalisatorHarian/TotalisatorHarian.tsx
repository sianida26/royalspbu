import React, {ButtonHTMLAttributes, forwardRef, LegacyRef} from 'react'

import moment from 'moment'
import {useSnackbar} from 'notistack'
import DatePicker from 'react-datepicker'
import {useHistory} from 'react-router'

import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'
import ModalStruk from '../../../../components/modals/ModalLihatStrukPengeluaran'
import TotalizatorReport from '../../../../models/TotalizatorReport'
import Penerimaan from '../../../../models/Penerimaan'
import Pengeluaran from '../../../../models/Pengeluaran'
import Penjualan from '../../../../models/Penjualan'
import Tabungan from '../../../../models/Tabungan'

import {numberWithCommas, formatRupiah, isToday} from '../../../../utils/helper'

interface ServerResponse {
    penerimaan: {
        tankName: string,
        volume: number,
    }[],
    pengeluaran: {
        id: number,
        reportFilename: string|null,
        name: string,
        amount: number,
    }[],
    penjualan: {
        income: number,
        price: number,
        tankName: string,
        volume: number
    }[],
    reporter: string,
    tabungan: {
        amount: number,
        report_filename: string,
    }|null,
}

//TODO: Buat handle error
export default function TotalisatorHarian() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {axios} = useAuth()
    const { setConfig } = useAdminConfig()

    const [date, setDate] = React.useState(new Date())
    const [loading, setLoading] = React.useState(true)
    const [report, setReport] = React.useState<TotalizatorReport|null>(null)
    const [showModal, setShowModal] = React.useState(false)
    const [imageUrl, setImageUrl] = React.useState('')

    React.useEffect(() => {
        requestLaporan()
    }, [date])

    const requestLaporan = () => {
        setLoading(true)
        axios({
            method: 'post',
            url: '/admin/totalizatorReport/getLaporan',
            data: {
                date: moment(date).format('D-M-YYYY')
            }
        })
        .then(result => { //handle success response
            let data : 0 | ServerResponse = result.data;
            if (data === 0) { //no report on selected date
                setReport(null)
            } else {
                let penerimaans = data.penerimaan.map(penerimaan => {
                    let model = new Penerimaan({volume: penerimaan.volume})
                    model.tankName = penerimaan.tankName
                    return model
                })

                let pengeluarans = data.pengeluaran.map(pengeluaran => {
                    return new Pengeluaran({
                        amount: pengeluaran.amount,
                        id: pengeluaran.id,
                        name: pengeluaran.name,
                        reportFilename: pengeluaran.reportFilename,
                        imageUrl: `/storage/images/receipts/pengeluaran/${pengeluaran.reportFilename}`
                    })
                })

                let penjualans = data.penjualan.map(penjualan => {
                    let model = new Penjualan({volume: penjualan.volume})
                    model.tankName = penjualan.tankName
                    model.price = penjualan.price
                    return model
                })

                let tabungan = data.tabungan === null ? undefined : new Tabungan({amount: data.tabungan.amount, reportFilename: data.tabungan.report_filename})

                setReport(new TotalizatorReport({
                    penerimaans, pengeluarans, penjualans, tabungan, date,
                    reporter: data.reporter,
                }))
            }
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
            setLoading(false)
        })
    }

    const handleShowModal = (url: string) => {
        setImageUrl(url)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setImageUrl('')
        setShowModal(false)
    }

    const handleEdit = () => {
        console.log('aku keklik')
        setConfig({editLaporanTotalisatorObject: report || new TotalizatorReport()})
        history.push('/laporan/totalisator-harian/edit')
    }

    const handleDownloadPDF = () => {

        const showFile = (data: string) => {
            window.open(data, '_blank')?.focus()
        }

        axios({
            method:'post', 
            url: '/admin/totalizatorReport/downloadPDF',
            data: {
                date: moment(date).format('D-M-YYYY'),
            }
        })
        .then(result => { //handle success response
            let data = result.data;
            showFile(data)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
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
            } else if (error.request){
                //Request was made but no response was received
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

    const handleCreateLaporanClick = () => {
        setConfig({
            createLaporanTotalisatorDate: date,
        })
        history.push('/laporan/totalisator-harian/buat')
    }

    const CalendarComponent = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-orange-500">
                <i className="bi bi-calendar2-week" />{props.value}
            </button>
        )
    }

    const renderReport = () => {

        return report === null ? renderNoReport() : (
            <div className="tw-px-4 tw-flex tw-flex-col tw-mt-4">
                <span>Pelapor: <span className="tw-font-semibold">Fulan bin Anonim</span></span>
                <span>Hari, Tanggal: <span className="tw-font-semibold">{moment(date).locale('id').format('dddd, LL')}</span></span>

                {/* Penerimaan BBM */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Penerimaan BBM</h1>
                    {
                    //   penerimaans.map(penerimaan => <p>{penerimaan.tankName}: {penerimaan.volume || '-'}</p>)  
                      report.penerimaans.map((penerimaan,i) => <div key={i} className="tw-flex tw-w-full tw-border-b tw-py-2 tw-items-center">
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
                        report.penjualans.map((penjualan, i) => <div key={i} className="tw-flex tw-flex-col tw-py-2">
                            <h2 className="tw-font-semibold tw-text-lg tw-text-orange-500">{penjualan.tankName}</h2>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Harga per Liter</span>
                                <span className="tw-text-gray-500">{formatRupiah(penjualan.price)}</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Volume Penjualan</span>
                                <span className="tw-text-gray-500">{numberWithCommas(penjualan.volume)} L</span>
                            </div>
                            <div className="tw-flex tw-justify-between tw-items-center">
                                <span>Total Penjualan</span>
                                <span className="tw-text-gray-900 tw-font-semibold">{formatRupiah(penjualan.getIncome())}</span>
                            </div>
                        </div>)
                    }
                </div>

                {/* Penjualan Kotor */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8 tw-rounded-md tw-bg-gray-100 tw-py-4 tw-px-2">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Total Penjualan Kotor</h1>
                    {
                    //   penerimaans.map(penerimaan => <p>{penerimaan.tankName}: {penerimaan.volume || '-'}</p>)  
                      report.penjualans.map((penjualan,i) => <div key={i} className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                          <span className="tw-w-32">{penjualan.tankName}</span>
                          <span className="tw-font-semibold tw-mr-2">:</span>
                          <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(penjualan.getIncome())} </span>
                        </div>)  
                    }

                    <div className="tw-mx-3 tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-items-center tw-mt-8">
                        <span className="tw-text-lg tw-font-medium">Total Penjualan Kotor</span>
                        <span className="tw-font-bold tw-text-orange-500 tw-text-xl">{formatRupiah(report.getGrossIncome())}</span>
                    </div>
                </div>

                {/* Biaya */}
                <div className="tw-relative tw-rounded-xl tw-border tw-border-black tw-flex tw-flex-col tw-px-2 tw-pb-3 tw-pt-6 tw-mt-8">
                    <span className="tw-absolute tw-px-2 tw-bg-white tw-text-lg tw-font-semibold tw--top-0.5 tw-left-1/2" style={{transform: 'translate(-50%, -50%)'}}>Biaya</span>
                    {
                        report.pengeluarans.length > 0 && <div className="tw-p-2">
                            {
                                report.pengeluarans.map((pengeluaran, i) => <div className="tw-border-b tw-border-gray-300 tw-py-2" key={i}>
                                    <div className="tw-flex tw-justify-between tw-py-2">
                                        <span>{i+1}. {pengeluaran.name}</span>
                                        <span>{formatRupiah(pengeluaran.amount)}</span> 
                                    </div>
                                    <div className="tw-flex tw-justify-around tw-w-full">
                                        <button
                                            className="btn-dense tw-bg-gray-300"
                                            onClick={() => handleShowModal(pengeluaran.reportFilename ? `/storage/images/receipts/pengeluaran/${pengeluaran.reportFilename}` : '')}
                                        >
                                            Lihat Struk
                                        </button>
                                    </div>
                                </div>)
                            }

                            <div className="tw-flex tw-justify-between tw-py-2">
                                <span>Total biaya</span>
                                <span>{formatRupiah(report.getTotalExpenses())}</span> 
                            </div>
                        </div>
                    }
                </div>

                {/* Tabungan */}
                {
                    report.tabungan && <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center tw-gap-2">
                        <h1 className="tw-text-center tw-font-bold tw-text-xl">Tabungan</h1>
                        <span className="tw-font-bold tw-text-orange-500 tw-text-xl">{formatRupiah(report.tabungan.amount)}</span>
                        <button 
                            className="btn-dense tw-bg-gray-300"
                            onClick={() => handleShowModal(`/storage/images/receipts/tabungan/${report.tabungan?.reportFilename}` || '')}
                        >
                            Lihat struk
                        </button>
                    </div>
                }

                {/* Penjualan Bersih */}
                <div className="tw-flex tw-w-full tw-flex-col tw-mt-8 tw-rounded-md tw-bg-gray-100 tw-py-4 tw-px-2">
                    <h1 className="tw-text-center tw-w-full tw-font-bold tw-text-xl tw-mb-2">Total Penjualan Bersih</h1>
                    
                    <div className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                        <span className="tw-w-40">Total Penjualan Kotor</span>
                        <span className="tw-font-semibold tw-mr-2">:</span>
                        <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(report.getGrossIncome())} </span>
                    </div>

                    <div className="tw-flex tw-w-full tw-border-b tw-border-gray-300 tw-py-2 tw-items-center">
                        <span className="tw-w-40">Total Biaya</span>
                        <span className="tw-font-semibold tw-mr-2">:</span>
                        <span className="tw-flex-grow tw-text-gray-500 tw-font-semibold"> {formatRupiah(report.getTotalExpenses())} </span>
                    </div>

                    <div className="tw-mx-3 tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-items-center tw-mt-8">
                        <span className="tw-text-lg tw-font-medium">Total Penjualan Bersih</span>
                        <span className="tw-font-bold tw-text-green-600 tw-text-xl">{formatRupiah(report.getNetIncome())}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="tw-py-8 tw-flex tw-justify-between">
                    {/* edit button */}
                    {
                        isToday(date) && <button onClick={handleEdit} className="btn-dense tw-border tw-border-orange-500 tw-text-orange-500">
                            <span>Edit</span>
                        </button>
                    }

                    {/* save button */}
                    <button 
                        className="btn-dense tw-bg-primary-500 tw-text-white"
                        onClick={handleDownloadPDF}
                    >
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>
        )
    }

    const renderNoReport = () => {

        return <div className="tw-flex-grow tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full">
            <img src={`/storage/assets/illustrations/undraw_Job_hunt_re_q203.svg`} alt="Ilustrasi belum ada laporan" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops!</h1>
            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Sepertinya Anda belum membuat laporan untuk hari ini</span>
        </div>
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-min-h-screen tw-relative">
            <ModalStruk show={showModal} url={imageUrl} handleClose={handleCloseModal} />
            <AdminHeaderSidebar title="Laporan Totalisator Harian" />
            <div className="tw-w-full tw-flex tw-flex-col tw-gap-2 tw-px-4 tw-mt-4 tw-flex-grow">
                <div className="tw-flex tw-justify-between tw-items-center tw-min-h-full">
                    <DatePicker 
                        selected={date}
                        onChange={(d) => {
                            if (!(d instanceof Date)) return
                            setDate(d)
                        }}
                        customInput={React.createElement(React.forwardRef(CalendarComponent))}
                        maxDate={new Date()}
                    />

                    {
                        report === null && !loading && <button onClick={handleCreateLaporanClick} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-green-500">
                            <i className="bi bi-calendar2-plus" />Buat Laporan
                        </button> 
                    }
                </div>
                {
                    loading? <div>Loading...</div>
                    : report !== null ? renderReport()
                    : renderNoReport()
                }
                </div>
        </div>
    )
}
