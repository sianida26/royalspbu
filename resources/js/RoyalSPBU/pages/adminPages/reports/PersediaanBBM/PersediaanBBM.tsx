import React, { ButtonHTMLAttributes } from 'react'

import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router'
import moment from 'moment'
import { useSnackbar } from 'notistack'


import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

import { IPersediaanReport } from '../../../../interfaces/reports/PersediaanReport'

export default function PersediaanBBM() {

    const history = useHistory()
    const { axios } = useAuth()
    const { setConfig } = useAdminConfig()
    const { enqueueSnackbar } = useSnackbar()

    const [date, setDate] = React.useState(new Date())
    const [loading, setLoading] = React.useState(true)
    const [reports, setReports] = React.useState<IPersediaanReport[]>([])

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
           console.log(result.data) //todo delete console
           let data: IPersediaanReport[] = result.data
           setReports(data)
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
    }, [date])

    const ShowCalendarButton = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-w-full tw-py-2 tw-border tw-border-black">
                {props.value}
            </button>
        )
    }

    const renderReports = () => {

        const handleClickTank = (report: IPersediaanReport) => {
            setConfig({
                persediaanReport: report, 
                persediaanReportDate: date
            })
            history.push('/laporan/persediaan/detail')
        }

        return <>
        {
            reports.map((report, i) => (<div className="tw-py-3 tw-border tw-border-black" onClick={() => handleClickTank(report)}>
                {report.tankName}
            </div>))
        }
        </>
    }

    return (
        <div className="tw-flex tw-flex-col">
            <DatePicker 
                selected={date}
                onChange={(d) => {
                    if (!(d instanceof Date)) return
                    setDate(d)
                }}
                customInput={React.createElement(React.forwardRef(ShowCalendarButton))}
                maxDate={new Date()}
            />
            {
                loading ? <div>Loading...</div>
                : reports.length ? renderReports()
                : <div>Tidak ada tangki yang tersedia</div>
            }
        </div>
    )
}
