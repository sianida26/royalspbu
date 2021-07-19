import React from 'react'

import {useHistory} from 'react-router'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'
import { isToday } from '../../../../utils/helper'

export default function Detail() {

    const history = useHistory()
    const {configs} = useAdminConfig()
    const [report, setReport] = React.useState(configs.pumpReportObejct!)

    React.useEffect(() => {
        if (configs.pumpReportObejct!.id < 0 ){
            history.replace('/laporan/pompa-harian')
        }
    }, [])

    return (
        <div className="tw-flex tw-w-full tw-flex-col">
            <p>Pelapor: {report.reporter}</p>
            <p>Hari, Tanggal: {report.createdAt}</p>
            <p className="tw-text-center">Laporan Pulau Pompa {report.pumpNumber}</p>
            {
                report.nozzles.map((nozzle,i) => {
                    const totalizatorDiff = Math.abs(nozzle.totalizatorFinal - nozzle.totalizatorInitial)
                    return (
                        <div className="tw-border tw-border-black tw-flex tw-flex-col tw-p-2" key={i}>
                            <p>Nozzle {i+1}</p>
                            <p>Nama Produk: {nozzle.productName}</p>
                            <p>Totalisator Awal: {nozzle.totalizatorInitial}</p>
                            <p>Totalisator Akhir: {nozzle.totalizatorFinal}</p>
                            <p>Volume Penjualan: {totalizatorDiff}</p>
                            <p>Harga per liter: Rp.{nozzle.price}</p>
                            <p>Total Pendapatan: Rp. {nozzle.price*totalizatorDiff}</p>
                            <p>Bukti Foto</p>
                            <img src={`/storage/images/reports/${nozzle.reportFilename}`} />
                        </div>
                    )
                })
            }
            <p>Total Pendapatan: {report.income}</p>
            {
                isToday(new Date(report.createdAt)) && <button className="tw-w-full tw-py-2 tw-text-center tw-bg-green-300">Izinkan edit</button>
            }
            {/* <button className="tw-w-full tw-py-2 tw-text-center tw-bg-blue-300" onClick={() => window.location.href = '/tests/testPDF'}>Download PDF</button> */}
        </div>
    )
}
