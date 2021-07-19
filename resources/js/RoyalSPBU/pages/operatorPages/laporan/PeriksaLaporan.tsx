import React from 'react'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../../providers/AuthProvider'
import { useHistory } from 'react-router'

import {Report} from '.'

interface Props {
    report : Report
    handleBack: () => void
}

export default function PeriksaLaporan({report, handleBack} : Props) {

    const {axios} = useAuth()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const [isLoading, setLoading] = React.useState(false)

    const handleSendReport = () => {
        setLoading(true)
        axios({url: '/sendPumpReport', method: 'post', data: {
            pumpId: report.id,
            pumpNumber: report.pumpNumber,
            nozzles: report.nozzles.map(nozzle => ({
                id: nozzle.id,
                finalTotalizator: nozzle.finalTotalizator,
                filename: nozzle.reportFilename
            }))
        }})
        .then(response => {
            console.log(response)
            history.replace('/')
            enqueueSnackbar('Laporan berhasil dikirim',{variant: 'success'})
        })
        .catch(err => {
            console.log(err)
            enqueueSnackbar('Yah error',{variant: 'error'})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <p className="tw-text-center">Laporan pulau pompa {report.pumpNumber+1}</p>
            {/* {
                Object.entries(report.nozzles).map(([nozzle, totalisator]) => (
                    <p>nozzle {nozzle} : {totalisator}</p>
                ))
            } */}
            {
                report.nozzles.map((nozzle, i) => {

                    let diff = Math.abs(nozzle.finalTotalizator - nozzle.initialTotalizator)

                    return (<div className="tw-w-full tw-flex tw-flex-col tw-border tw-p-2 tw-border-black" key={nozzle.id}>
                        <p className="tw-text-center tw-font-bold">Nozzle {i+1}</p>
                        <p>Nama Produk: {nozzle.productName}</p>
                        <p>Totalisator Awal: {nozzle.initialTotalizator} L</p>
                        <p>Totalisator AKhir: {nozzle.finalTotalizator} L</p>
                        <p>Volume penjualan: {diff} L</p>
                        <p>Harga per liter: Rp{nozzle.price}</p>
                        <p>Total pendapatan: Rp{nozzle.price*diff}</p>
                        <p>Bukti foto</p>
                        <img src={nozzle.imageUrl} />
                    </div>
                )})
            }
            <p className="tw-font-bold">Pendapatan: {report.nozzles.reduce((current, nozzle) => {
                let diff = Math.abs(nozzle.finalTotalizator - nozzle.initialTotalizator)
                return nozzle.price*diff+current
            },0)}</p>
            <button className="tw-border tw-bg-gray-400 tw-my-2" onClick={handleBack}>Kembali</button>
            <button className="tw-border tw-bg-gray-400" onClick={handleSendReport}>Kirim</button>
        </div>
    )
}
