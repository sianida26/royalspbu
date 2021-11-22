import React, { ButtonHTMLAttributes } from 'react'

import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router'
import moment from 'moment'
import { useSnackbar } from 'notistack'


import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

import PersediaanReport from '../../../../models/PersediaanReport'

import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'
import Penerimaan from '../../../../models/Penerimaan'
import Tank from '../../../../models/Tank'

interface ServerResponse {
    id: number,
    initialStock: number,
    penerimaan: {
        actualVolume: number,
        initialVolume: number,
        pnbp: string,
        pnbpVolume: number,
        truckId: string,
        volumeDiff: number,
    } | null,
    product: string,
    tankId: number,
    tankName: string,
    theoriticalStock: number,
    actualStock: number,
    volumeOut: number,
    reporter: string,
}

export default function PersediaanBBM() {

    const history = useHistory()
    const { axios } = useAuth()
    const { setConfig } = useAdminConfig()
    const { enqueueSnackbar } = useSnackbar()

    const [date, setDate] = React.useState(new Date())
    const [loading, setLoading] = React.useState(true)
    const [reports, setReports] = React.useState<PersediaanReport[]>([])

    React.useEffect(() => {
        setLoading(true)
        axios({
            method: 'post',
            url: '/admin/persediaanReport/getReportData',
            data: {
                date: moment(date).format('D-M-YYYY')
            }
        })
        .then(result => { //handle success response
           let data: ServerResponse[] = result.data
           setReports(data.map(report => {

                let tank = new Tank({
                    id: report.tankId,
                    name: report.tankName,
                    volumeOut: report.volumeOut
                })
                tank.product.name = report.product
               
                let penerimaan = report.penerimaan === null ? null : new Penerimaan({
                    actualVolume: report.penerimaan.actualVolume,
                    initialVolume: report.penerimaan.initialVolume,
                    pnbp: report.penerimaan.pnbp,
                    pnbpVolume: report.penerimaan.pnbpVolume,
                    truckId: report.penerimaan.truckId,
                })
                
                let model = new PersediaanReport({
                    actualStock: report.actualStock,
                    id: report.id,
                    initialStock: report.initialStock,
                    penerimaan: penerimaan,
                    reporter: report.reporter,
                    tank: tank,
                    theoriticalStock: report.theoriticalStock,
                })
                return model
           }))
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
    }, [date])

    const ShowCalendarButton = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-orange-500">
                <i className="bi bi-calendar2-week" /> {props.value}
            </button>
        )
    }

    const renderReports = () => {

        const handleClickTank = (report: PersediaanReport) => {
            setConfig({
                persediaanReport: report, 
                persediaanReportDate: date
            })
            history.push('/laporan/persediaan/detail')
        }

        return <>
        {
            reports.map((report, i) => (<div 
                                            key={i} 
                                            className={`tw-border-2 ${report.id < 0 ? 'tw-border-gray-500' : 'tw-border-primary-500'} tw-px-4 tw-py-2 tw-text-lg tw-font-bold tw-rounded-lg`} 
                                            style={{boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.25)'}}
                                            onClick={() => handleClickTank(report)}>
                {report.tankName}
            </div>))
        }
        </>
    }

    const renderNoTank = () => {

        return <div className="tw-flex-grow tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full">
            <img src={`/storage/assets/illustrations/undraw_Job_hunt_re_q203.svg`} alt="Ilustrasi belum ada laporan" className="tw-w-full tw-max-w-screen-sm lg:tw-w-64" />
            <h1 className="tw-text-center tw-font-bold tw-text-4xl tw-mt-8">Oops!</h1>
            <span className="tw-text-center tw-text-gray-800 tw-mt-3">Sepertinya Anda belum membuat tangki. Silakan buat tangki terlebih dahulu</span>
        </div>
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Catatan Persediaan BBM" />
            <div className="tw-p-4 tw-flex-col tw-w-full tw-max-w-screen-md tw-self-center">
                <div className="tw-flex tw-justify-around tw-items-center tw-mb-4">
                    <div className="tw-w-full">
                        <DatePicker 
                            selected={date}
                            onChange={(d) => {
                                if (!(d instanceof Date)) return
                                setDate(d)
                            }}
                            customInput={React.createElement(React.forwardRef(ShowCalendarButton))}
                            maxDate={new Date()}
                        />
                    </div>


                </div>
                {
                    loading ? <p className="tw-text-center">Loading...</p>
                    : reports.length > 0 ? <div className="tw-flex tw-flex-col tw-gap-4">
                        {renderReports()}
                    </div>
                    : renderNoTank()
                }
            </div>
        </div>
    )
}
