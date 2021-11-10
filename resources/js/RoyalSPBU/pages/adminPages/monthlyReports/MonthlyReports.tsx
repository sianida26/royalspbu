import React, {ButtonHTMLAttributes} from 'react'

import {useHistory} from 'react-router'

import DatePicker from 'react-datepicker'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

export default function MonthlyReports() {

    const [selectedDate, setSelectedDate] = React.useState(new Date())

    const history = useHistory()

    const CalendarComponent = (props: React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, ref: React.Ref<HTMLButtonElement>) => {
        return (
            <button onClick={props.onClick} ref={ref} className="tw-rounded-lg tw-py-2 tw-px-3 tw-flex tw-gap-2 tw-justify-center tw-items-center tw-text-white tw-bg-orange-500">
                <i className="bi bi-calendar2-week" />{props.value}
            </button>
        )
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Laporan Bulanan" />
            <div className="tw-flex tw-flex-col tw-px-4 tw-mt-4 tw-gap-4">
                <DatePicker
                    selected={selectedDate}
                    dateFormat="MM/yyyy"
                    onChange={(date) => {
                        if (!(date instanceof Date)) return
                        setSelectedDate(date)
                    }}
                    customInput={React.createElement(React.forwardRef(CalendarComponent))}
                    showMonthYearPicker
                    />
                
                <button 
                    className="tw-w-full tw-bg-orange-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center tw-text-center" 
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                    onClick={() => history.push('/laporan-bulanan/persediaan')}
                >
                    Download Catatan Persediaan Bulanan
                </button>

                <div 
                    className="tw-w-full tw-bg-primary-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center tw-text-center"
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    Download Laporan Stok, Realisasi Penerimaan dan Penyaluran
                </div>

                <div 
                    className="tw-w-full tw-bg-green-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center tw-text-center"
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    Download Laporan Laba dan Rugi
                </div>
            </div>
        </div>
    )
}
