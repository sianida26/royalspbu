import React, {ButtonHTMLAttributes, forwardRef, LegacyRef} from 'react'

import {parse, format} from 'date-fns'
import id from 'date-fns/locale/id'

import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useHistory } from 'react-router'
import { useAuth } from '../../../providers/AuthProvider'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import DatePicker, {registerLocale} from 'react-datepicker'
import Penerimaan from '../../../models/Penerimaan'
import {numberWithCommas, isToday} from '../../../utils/helper'
import ModalDeletePenerimaan from '../../../components/modals/ModalDeletePenerimaan'

interface ServerResponse{
    actualVolume? : number,
    id: number,
    initialVolume? : number,
    issueTimestamp: string,
    issuer: string,
    pnbp?: string,
    pnbpVolume: number,
    receiveTimestamp?: string,
    receiver?: string,
    tankId: number,
    tankName: string,
    truckId?: string
}

export default function ListPenerimaan() {

    const history = useHistory()
    const {axios} = useAuth()
    const {configs, setConfig} = useAdminConfig()

    const [ongoings, setOngoings] = React.useState<Penerimaan[]>([])
    const [isError, setError] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState('')
    const [showModal, setShowModal] = React.useState(false)
    const [deletedPenerimaan, setDeletedPenerimaan] = React.useState<Penerimaan>(new Penerimaan())
    const [finishedPenerimaans, setFinishedPenerimaan] = React.useState<Penerimaan[]>([])
    const [isLoading, setLoading] = React.useState(true)
    const [date, setDate] = React.useState(new Date())

    React.useEffect(() => {
        registerLocale("id", id)
    },[])

    React.useEffect(() => {
        getAllPenerimaan()
    }, [date])

    const getAllPenerimaan = () => {
        setLoading(true)
        setError(false)
        axios({
            method: 'post',
            url: '/admin/penerimaan/all',
            data: {
                m: format(date, 'MM-yyyy')
            }
        })
        .then(response => {
            console.log(response.data)
            let data: ServerResponse[] = response.data
            let penerimaans = data.map(x => {

                let issueTimestamp = parse(x.issueTimestamp, 'yyyy-MM-dd HH:mm:ss', new Date())
                let receiveTimestamp = x.receiveTimestamp ? parse(x.receiveTimestamp, 'yyyy-MM-dd HH:mm:ss', new Date()) : null

                let model = new Penerimaan({
                    actualVolume: x.actualVolume || 0,
                    id: x.id,
                    initialVolume: x.initialVolume || 0,
                    issueTimestamp: issueTimestamp,
                    issuer: x.issuer,
                    pnbp: x.pnbp || '',
                    pnbpVolume: x.pnbpVolume,
                    receiveTimestamp: receiveTimestamp,
                    receiver: x.receiver || '',
                    truckId: x.truckId || '',
                })

                model.tankName = x.tankName
                model.tankId = x.tankId
                return model
            })
            setOngoings(penerimaans.filter(penerimaan => {
                return penerimaan.isNotReceived()
            }))
            setFinishedPenerimaan(penerimaans.filter(penerimaan => {
                return penerimaan.isReceived()
            }))
        })
        .catch(error => {
            console.log(error.response)
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
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
                    case 500: //server error
                        errorMessage=`Terjadi error di dalam server. silakan coba lagi nanti (${errorCode}) msg:${error.response.data.message}`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Terjadi error (${errorCode}).`;
                }
            } else if (error.request){
                //Request was made but no response was received
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            setError(true)
            setErrorMsg(errorMessage)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleEditOngoing = (penerimaan: Penerimaan) => {
        setConfig({
            editRequestPenerimaanObject: penerimaan
        })
        history.push('/penerimaan/minta/edit')
    }

    const handleEditFinished = (penerimaan: Penerimaan) => {
        setConfig({
            editFinishedPenerimaanObject: penerimaan
        })
        history.push('/penerimaan/konfirmasi/edit')
    }

    const handleKonfirmasi = (penerimaan: Penerimaan) => {
        setConfig({
            konfirmasiPenerimaanObject: penerimaan
        })
        history.push('/penerimaan/konfirmasi')
    }

    const handleDetail = (penerimaan: Penerimaan) => {
        setConfig({
            detailPenerimaanObject: penerimaan
        })
        history.push('/penerimaan/detail')
    }

    const handleShowModal = (penerimaan: Penerimaan) => {
        setDeletedPenerimaan(penerimaan)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleFinishDelete = () => {
        getAllPenerimaan()
        closeModal()
    }

    const CalendarComponent = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-orange-500">
                <i className="bi bi-calendar2-week" />{props.value}
            </button>
        )
    }

    const renderError = () => {

        return <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-8 tw-py-8">
            <img src="/storage/assets/illustrations/undraw_bug_fixing_oc7a.svg" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops! Terjadi kesalahan.</h1>
            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Terdapat error sehingga data tidak dapat ditampilkan. Silakan coba beberapa saat lagi</span>
            <span className="tw-text-center tw-mt-2 tw-text-sm tw-text-gray-700">{errorMsg}</span>
            <button 
                className="tw-px-3 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded-lg tw-shadow-md tw-flex tw-gap-2 tw-mt-2 tw-items-center"
                onClick={() => getAllPenerimaan()}
            >
                <i className="bi bi-arrow-repeat tw-text-lg" />
                Coba lagi
            </button>
        </div>
    }

    return (
        <div className="tw-flex tw-flex-col tw-w-full">
            <AdminHeaderSidebar title="Penerimaan BBM" />
            <ModalDeletePenerimaan show={showModal} penerimaan={deletedPenerimaan} onFinished={() => closeModal()} onClose={handleFinishDelete} />

            {/* header buttons */}
            <div className="tw-flex tw-justify-between tw-items-center tw-min-h-full tw-mt-4 tw-px-4 tw-w-full tw-max-w-screen-md tw-self-center">
                <DatePicker 
                    selected={date}
                    onChange={(d) => {
                        if (!(d instanceof Date)) return
                        setDate(d)
                    }}
                    showMonthYearPicker
                    locale="id"
                    dateFormat="MMMM yyyy"
                    customInput={React.createElement(React.forwardRef(CalendarComponent))}
                    maxDate={new Date()}
                />

                <button onClick={() => {history.push('/penerimaan/minta')}} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-green-500">
                    <i className="bi bi-calendar2-plus" />Buat Permintaan
                </button> 
            </div>
            
            {
                isError ? renderError()
                : <div className="tw-flex tw-flex-col tw-w-full tw-max-w-screen-md tw-self-center">
                    {/* Sedang diproses */}
                    <div className="tw-flex tw-mt-4 tw-flex-col tw-px-4 tw-py-2 tw-w-full tw-border-t tw-border-b tw-border-gray-300 tw-text-center tw-justify-center tw-items-center">
                        <h2 className="tw-font-medium tw-italic tw-mb-2">Sedang diproses</h2>
                        <div className="tw-mt-2 tw-flex tw-flex-col tw-gap-4">
                            {
                                isLoading ? <span>Loading...</span>
                                : ongoings.length < 1 ? <span>Tidak ada data</span>
                                : ongoings.map((penerimaan,i) => <div key={penerimaan.id} className="tw-w-full tw-flex tw-gap-2">
                                    <p className="tw-w-5 tw-flex-shrink-0 tw-text-right">
                                        {i+1}.
                                    </p>
                                    <div className="tw-flex tw-flex-col">
                                        <p>Tanggal permintaan: <b>{penerimaan.getFormattedIssueTimestamp()}</b></p>
                                        <p>Pemohon: <b>{penerimaan.issuer}</b></p>
                                        <p>Nama Tangki: <b>{penerimaan.tankName}</b></p>
                                        <p>Volume PNBP: <b>{numberWithCommas(penerimaan.pnbpVolume)} L</b></p>

                                        <div className="tw-flex tw-justify-between tw-items-center tw-mt-4 tw-gap-4">
                                            <button 
                                                className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-orange-600 tw-border tw-border-orange-600 tw-w-8 tw-h-8"
                                                onClick={() => handleEditOngoing(penerimaan)}
                                            >
                                                <i className="bi bi-pencil-fill" />
                                            </button>
                                            <button 
                                                className="tw-flex-grow tw-rounded-full tw-bg-green-600 tw-text-white tw-py-1"
                                                onClick={() => handleKonfirmasi(penerimaan)}
                                            >
                                                Sudah diterima
                                            </button>
                                            <button 
                                                className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-red-500 tw-border tw-border-red-500 tw-w-8 tw-h-8"
                                                onClick={() => handleShowModal(penerimaan)}
                                            >
                                                <i className="bi bi-trash-fill" />
                                            </button>
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>

                    {/* History */}
                    <div className="tw-flex tw-mt-4 tw-flex-col tw-px-4 tw-py-2 tw-w-full tw-border-t tw-border-b tw-border-gray-300 tw-items-center tw-justify-center">
                        <h2 className="tw-font-medium tw-italic tw-mb-2 tw-text-center">Riwayat Penerimaan</h2>
                        <div className="tw-mt-2 tw-flex tw-flex-col tw-gap-4">
                            {
                                isLoading ? <span>Loading...</span>
                                : finishedPenerimaans.length < 1 ? <span>Tidak ada data</span>
                                : finishedPenerimaans.map((penerimaan,i) => <div key={penerimaan.id} className="tw-w-full tw-flex tw-gap-2">
                                    <p className="tw-w-5 tw-flex-shrink-0 tw-text-right">
                                        {i+1}.
                                    </p>
                                    <div className="tw-flex tw-flex-col">
                                        <p>tanggal penerimaan: <b>{penerimaan.getFormattedReceiveTimestamp()}</b></p>
                                        <p>Nama Tangki: <b>{penerimaan.tankName}</b></p>
                                        <div className="tw-w-full tw-flex tw-justify-around tw-mt-4">
                                            {
                                                isToday(penerimaan.receiveTimestamp || new Date(0)) && <button 
                                                    className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-orange-600 tw-border tw-border-orange-600 tw-px-3 tw-py-1 tw-gap-2"
                                                    onClick={() => handleEditFinished(penerimaan)}
                                                >
                                                    <i className="bi bi-pencil-fill" /> Edit
                                                </button>
                                            }
                                            
                                            <button 
                                            className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-green-600 tw-border tw-border-green-600 tw-px-3 tw-py-1 tw-gap-2"
                                                onClick={() => handleDetail(penerimaan)}
                                            >  
                                                <i className="bi bi-eye-fill" /> Lihat
                                            </button>
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
