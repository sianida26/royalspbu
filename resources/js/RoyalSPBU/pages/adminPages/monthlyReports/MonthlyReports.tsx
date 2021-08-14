import React from 'react'

import DatePicker from 'react-datepicker'

export default function MonthlyReports() {

    const [selectedDate, setSelectedDate] = React.useState(new Date())

    return (
        <div className="tw-flex tw-flex-col">
            <span>Bulan</span>
            <DatePicker
                selected={selectedDate}
                dateFormat="MM/yyyy"
                onChange={(date) => {
                    if (!(date instanceof Date)) return
                    setSelectedDate(date)
                }}
                showMonthYearPicker
                />
            
            <div className="tw-border tw-border-black tw-my-2">
                Download Catatan Persediaan Bulanan
            </div>

            <div className="tw-border tw-border-black tw-my-2">
                Download Laporan Stok, Realisasi Penerimaan dan Penyaluran
            </div>
        </div>
    )
}
