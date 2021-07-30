import React, {ButtonHTMLAttributes, forwardRef, LegacyRef} from 'react'

import moment from 'moment'
import DatePicker from 'react-datepicker'

import {useHistory} from 'react-router'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

interface Report {
    createdAt : string,
    editable: boolean,
    id: number,
    income: number,
    nozzles: Nozzle[],
    pumpId: number,
    pumpNumber: number,
    reporter: string,
}

interface Nozzle {
    price: number,
    productName: string,
    reportFilename: string,
    totalizatorFinal: number,
    totalizatorInitial: number,
}

interface CalendarProps {
    value: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function PompaHarian() {

    const history = useHistory()
    const {axios} = useAuth()

    const [reports, setReports] = React.useState<Report[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
    const [date, setDate] = React.useState(new Date())
    const {configs, setConfig} = useAdminConfig()

    React.useEffect(() => {
        
    },[])

    React.useEffect(() => {
        setLoading(true)
        axios({method: 'get', url: `/admin/dailyPumpReport/all?date=${moment(date).format('L')}`})
        .then(response => {
            let data : Report[] = response.data
            setReports(data)
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    },[date])

    const handleReportClick = (report: Report) => {
        setConfig({
            pumpReportObejct: report
        })
        history.push('/laporan/pompa-harian/detail')
    }

    const handleClickCalendarButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsCalendarOpen(!isCalendarOpen)
    }

    const handleDateChange = (d: Date) => {
        setIsCalendarOpen(false)
        setDate(d)
    }

    const CalendarComponent = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref}>
                {props.value}
            </button>
        )
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
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
                : reports.length < 1 ? <div>Tidak ada data</div>
                : <div className="tw-w-full tw-flex tw-flex-col">
                    {
                        reports.map(report => (
                            <div className="tw-w-full tw-p-2 tw-border tw-border-black tw-my-2" key={report.id} onClick={()=>handleReportClick(report)}>
                                <p>Tanggal: {report.createdAt}</p>
                                <p>Pelapor: {report.reporter}</p>
                                <p>Nomor pompa: {report.pumpNumber}</p>
                                <p>Pemasukan pompa: {report.income}</p>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}
