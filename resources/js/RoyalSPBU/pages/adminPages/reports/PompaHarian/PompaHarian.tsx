import React, {ButtonHTMLAttributes, forwardRef, LegacyRef} from 'react'

import moment from 'moment'
import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'
import DailyPumpReport from '../../../../models/DailyPumpReport'
import Pump from '../../../../models/Pump'
import Nozzle from '../../../../models/Nozzle'
import DatePicker from 'react-datepicker'
import {useHistory} from 'react-router'

import {formatRupiah} from '../../../../utils/helper'


import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'

interface ServerResponse {
    createdAt : string,
    editable: boolean,
    id: number,
    income: number,
    nozzles: {
        price: number,
        productName: string,
        reportFilename: string,
        totalizatorFinal: number,
        totalizatorInitial: number,
    }[],
    pumpId: number,
    pumpNumber: number,
    reporter: string,
}

interface CalendarProps {
    value: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function PompaHarian() {

    const history = useHistory()
    const {axios} = useAuth()

    const [reports, setReports] = React.useState<DailyPumpReport[]>([])
    const [loading, setLoading] = React.useState(true)
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
    const [date, setDate] = React.useState(new Date())
    const {configs, setConfig} = useAdminConfig()

    React.useEffect(() => {
        
    },[])

    React.useEffect(() => {
        setLoading(true)
        axios({method: 'get', url: `/admin/dailyPumpReport/all?date=${moment(date).format('D-M-YYYY')}`})
        .then(response => {
            let data : ServerResponse[] = response.data
            setReports(data.map(x => {

                let nozzles: Nozzle[] = x.nozzles.map(y => {
                    let nozzle = new Nozzle({
                        
                    })
                    nozzle.price = y.price
                    nozzle.productName = y.productName
                    nozzle.reportFilename = y.reportFilename
                    nozzle.totalizator = y.totalizatorFinal
                    nozzle.initialTotalizator = y.totalizatorInitial
                    return nozzle
                })

                let pump = new Pump({
                    id: x.pumpId,
                    pumpNumber: x.pumpNumber,
                    nozzles: nozzles,
                })

                let report = new DailyPumpReport({
                    id: x.id,
                    reporter: x.reporter,
                    income: x.income,
                    createdAt: x.createdAt,
                    editable: x.editable,
                    pump: pump,
                })
                return report
            }))
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    },[date])

    const handleReportClick = (report: DailyPumpReport) => {
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
            <button onClick={props.onClick} ref={ref} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-orange-500">
                <i className="bi bi-calendar2-week" />{props.value}
            </button>
        )
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Laporan Pompa Harian" />
            <div className="tw-w-full tw-flex tw-flex-col tw-mt-4 tw-px-4 tw-gap-4">
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
                    : <div className="tw-w-full tw-flex tw-flex-col tw-gap-4">
                        {
                            reports.map(report => (
                                <div className="tw-w-full tw-border-gray-400 tw-rounded-md tw-flex tw-gap-2 tw-border tw-py-2 tw-px-4" key={report.id} onClick={()=>handleReportClick(report)}  style={{boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                                    {/* <p>Tanggal: {report.createdAt}</p>
                                    <p>Pelapor: {report.reporter}</p>
                                    <p>Nomor pompa: {report.pumpNumber}</p>
                                    <p>Pemasukan pompa: {report.income}</p> */}
                                    <div className="tw-flex tw-flex-col tw-gap-1 tw-flex-grow">
                                        <span>{report.reporter}</span>
                                        <span className="tw-font-bold tw-text-lg">Pompa {report.pump.pumpNumber}</span>
                                    </div>
                                    <div className="tw-w-40 tw-flex tw-justify-end tw-items-center tw-text-orange-500 tw-font-bold tw-text-xl">
                                        <span>({formatRupiah(report.income)})</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}
