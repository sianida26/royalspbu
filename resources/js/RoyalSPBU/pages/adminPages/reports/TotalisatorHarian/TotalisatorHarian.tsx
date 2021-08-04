import React, {ButtonHTMLAttributes, forwardRef, LegacyRef} from 'react'

import moment from 'moment'
import {useSnackbar} from 'notistack'
import DatePicker from 'react-datepicker'
import {useHistory} from 'react-router'


import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'
import ModalStruk from '../../../../components/modals/ModalLihatStrukPengeluaran'

interface Report {
    penerimaan: Penerimaan[],
    pengeluaran: Pengeluaran[],
    penjualan: Penjualan[],
    reporter: string,
    tabungan: Tabungan|null,
}

interface Penerimaan {
    tankName: string,
    volume: number,
}

interface Pengeluaran {
    id: number,
    reportFilename: string|null,
    name: string,
    amount: number,
}

interface Penjualan {
    income: number,
    price: number,
    tankName: string,
    volume: number
}

interface Tabungan {
    amount: number,
    report_filename: string,
}

export default function TotalisatorHarian() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const {axios} = useAuth()
    const { setConfig } = useAdminConfig()

    const [date, setDate] = React.useState(new Date())
    const [loading, setLoading] = React.useState(true)
    const [report, setReport] = React.useState<Report|null>(null)
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
            let data : 0 | Report = result.data;
            console.log(data) //todo remove log
            if (data === 0) {
                setReport(null)
            } else {
                setReport(data)
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

    const handleShowModal = (filename: string) => {
        setImageUrl(`/storage/images/receipts/${filename}`)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setImageUrl('')
        setShowModal(false)
    }

    const handleEdit = () => {
        console.log('aku keklik')
        setConfig({
            editLaporanTotalisatorObject: {
                date,
                pengeluaran: report?.pengeluaran || [],
                tabungan: report?.tabungan || null,
            }
        })
        history.push('/laporan/totalisator-harian/edit')
    }

    const CalendarComponent = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-w-full tw-py-2 tw-border tw-border-black">
                {props.value}
            </button>
        )
    }

    const renderReport = () => {

        const totalPenjualanKotor = report?.penjualan.reduce((accumulator, currentValue) => accumulator+currentValue.income, 0) || 0
        const totalPengeluaran = report?.pengeluaran.reduce((accumulator, currentValue) => accumulator+currentValue.amount, 0) || 0

        return report === null ? renderTambahLaporan() : (
            <div className="tw-w-full tw-flex tw-flex-col">
                <span>Pelapor: {report.reporter}</span>
                <span>Hari/Tanggal: {moment(date).format('D-M-YYYY')}</span>
                <h1 className="tw-font-bold tw-mt-3 tw-text-center">Penerimaan BBM</h1>
                {
                    report.penerimaan.map(penerimaan => <span>{penerimaan.tankName}: {penerimaan.volume} L</span>)
                }
                <h1 className="tw-mt-3 tw-font-bold tw-text-center">Penjualan</h1>
                {
                    report.penjualan.map(penjualan => {

                        return <div className="tw-border tw-border-black tw-flex tw-flex-col tw-py-2">
                            <h2 className="tw-font-semibold">{penjualan.tankName}</h2>
                            <p>Harga per liter: {penjualan.price}</p>
                            <p>Volume penjualan: {penjualan.volume}</p>
                            <p>Total Penjualan: {penjualan.income}</p>
                        </div>
                    })
                }
                <h1 className="tw-mt-3 tw-font-bold tw-text-center">Total Penjualan Kotor</h1>
                {
                    report.penjualan.map(penjualan => <p>{penjualan.tankName}: {penjualan.income}</p>)
                }
                <p>Total Penjualan: {totalPenjualanKotor}</p>

                <h1 className="tw-mt-3 tw-font-bold tw-text-center">Biaya</h1>
                {
                    report.pengeluaran.map(pengeluaran => {
                        
                        return <div className="tw-border tw-border-black tw-flex tw-flex-col tw-py-2">
                            <p>{pengeluaran.name}</p>
                            <p>Biaya: {pengeluaran.amount}</p>
                            {pengeluaran.reportFilename && <span className="tw-bg-gray-300 tw-py-2" onClick={() => handleShowModal(`pengeluaran/${pengeluaran.reportFilename || ''}`)}>Lihat struk</span>}
                        </div>
                    })
                }
                <p>Total Pengeluaran: {totalPengeluaran}</p>

                <h1 className="tw-mt-3 tw-font-bold tw-text-center">Tabungan</h1>
                <span>Rp{report.tabungan ? report.tabungan.amount : 0}</span>
                {report.tabungan && <span className="tw-bg-gray-300 tw-py-2" onClick={() => handleShowModal(`tabungan/${report.tabungan?.report_filename || ''}`)} >Lihat struk</span>}

                <h1 className="tw-mt-3 tw-font-bold tw-text-center">Total Pendapatan Bersih</h1>
                <span>Penjualan kotor: {totalPenjualanKotor}</span>
                <span>Total biaya: {totalPengeluaran}</span>
                <span className="tw-font-bold">Total Pendapatan Bersih: Rp{totalPenjualanKotor-totalPengeluaran}</span>
                <button className="tw-border tw-border-black tw-py-2 tw-my-2" onClick={handleEdit}>Edit</button>
                <button className="tw-border tw-border-black tw-py-2 tw-my-2">Download PDF</button>
            </div>
        )
    }

    const renderTambahLaporan = () => {

        return <button className="tw-w-full tw-py-2 tw-border tw-border-black" onClick={() => history.push('/laporan/totalisator-harian/buat')}>Buat Laporan</button>
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
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
                loading? <div>Loading...</div>
                : report !== null ? renderReport()
                : renderTambahLaporan()
            }
            <ModalStruk show={showModal} url={imageUrl} handleClose={handleCloseModal} />
        </div>
    )
}
