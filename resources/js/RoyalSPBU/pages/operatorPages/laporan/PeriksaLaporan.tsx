import React from 'react'

import DailyPumpReport from '../../../models/DailyPumpReport'
import { formatRupiah, numberWithCommas } from '../../../utils/helper'
import { useAuth } from '../../../providers/AuthProvider'
import { useConfig, ReportStatus } from '../../../providers/ConfigProvider'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'


//TODO: handle error when submitting

interface Props {
    report : DailyPumpReport
    handleBack: () => void
}

export default function PeriksaLaporan(props : Props) {

    const {axios} = useAuth()
    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()
    const { setConfig } = useConfig()

    const [isLoading, setLoading] = React.useState(false)

    const handleSendReport = () => {
        setLoading(true)
        axios({url: '/sendPumpReport', method: 'post', data: {
            pumpId: props.report.pump.id,
            pumpNumber: props.report.pump.pumpNumber,
            nozzles: props.report.pump.nozzles.map(nozzle => ({
                id: nozzle.id,
                finalTotalizator: nozzle.totalizator,
                filename: nozzle.reportFilename
            }))
        }})
        .then(response => {
            history.replace('/')
            setConfig({
                laporanStatus: ReportStatus.SUDAH_LAPORAN,
            })
            enqueueSnackbar('Laporan berhasil dikirim',{variant: 'success'})
        })
        .catch(err => {
            enqueueSnackbar('Yah error',{variant: 'error'})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div 
            className="tw-flex tw-flex-col tw-max-w-screen-sm tw-w-full tw-items-center tw-justify-center tw-mt-2 tw-px-5 tw-py-5 tw-bg-white tw-rounded-xl tw-gap-4"
            style={{boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.25)', borderRadius: '12px'}}
        >
            <p className="tw-font-semibold tw-text-gray-500 tw-text-xl">Laporan Pulau Pompa {props.report.pump.pumpNumber}</p>
            {props.report.pump.nozzles.map((nozzle, i) => 
                {
                    return <div key={nozzle.id} className="tw-flex tw-flex-col tw-items-center tw-w-full tw-bg-gray-100 tw-py-4 tw-px-2 tw-rounded-lg">
                        <div className="tw-grid tw-grid-cols-7 tw-gap-2 tw-w-full tw-items-center tw-justify-center">
                            <div className="tw-col-span-3 tw-font-semibold tw-text-lg">Nozzle {i+1}</div>
                            <div className="tw-col-span-4" />
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Nama Produk</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{nozzle.productName}</div>
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Totalisator Awal</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{numberWithCommas(nozzle.initialTotalizator)} L</div>
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Totalisator Akhir</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{numberWithCommas(nozzle.totalizator)} L</div>
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Volume Penjualan</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{numberWithCommas(nozzle.getTotalizatorDiff())} L</div>
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Harga per Liter</div>
                            <div className="tw-col-span-3 tw-font-semibold tw-text-gray-600 tw-mt-2">{formatRupiah(nozzle.price)}</div>
                            <div className="tw-col-span-4 tw-font-medium tw-mt-2">Total pendapatan</div>
                            <div className="tw-col-span-3 tw-font-bold tw-text-gray-600 tw-mt-2">{formatRupiah(nozzle.getRevenue())}</div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-w-full tw-mt-4 tw-bg-white tw-px-4 tw-py-4">
                            <div className="">Bukti Foto</div>
                            <img src={nozzle.imageUrl} alt="Bukti Laporan" className="tw-max-w-full" />
                        </div>
                    </div>
                })
            }


            <div className="tw-flex tw-flex-col tw-w-full tw-bg-gray-100 tw-py-4 tw-px-2 tw-rounded-lg">
                <p className="tw-text-center tw-text-xl tw-font-bold tw-mb-2">Total Pendapatan Pompa {props.report.pump.pumpNumber}</p>
                {
                    props.report.pump.nozzles.map((nozzle, i) => {

                        return <div key={i} className="tw-flex tw-gap-2">
                            <div className="tw-w-20">Nozzle {i+1}</div>
                            <div className="">:</div>
                            <div className="tw-font-semibold">{formatRupiah(nozzle.getRevenue())}</div>
                        </div>
                    })
                }
                <div className="tw-mt-4 tw-w-full tw-rounded-lg tw-bg-white tw-py-4 tw-px-2 tw-flex tw-flex-col tw-items-center">
                    <span className="tw-text-xl">Total pendapatan</span>
                    <span className="tw-text-green-600 tw-font-extrabold tw-text-3xl">{formatRupiah(props.report.getRevenue())}</span>
                </div>
            </div>
            <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-my-10">
                <button 
                    className={`tw-border tw-border-orange-500 tw-rounded-full tw-py-1 tw-px-3 tw-text-center tw-justify-center tw-font-semibold tw-text-orange-500 focus:tw-outline-none ${isLoading && 'tw-opacity-75'}`}
                    disabled={isLoading}
                    onClick={() => props.handleBack()}
                >
                    Kembali
                </button>
                <button 
                    disabled={isLoading}
                    className={`tw-bg-primary-500 tw-border tw-border-primary-500 tw-rounded-full tw-py-1 tw-px-3 tw-text-center tw-justify-center tw-font-semibold tw-text-white focus:tw-outline-none ${isLoading && 'tw-opacity-75'}`}
                    onClick={handleSendReport}
                >
                    {isLoading ? 'Mengirim...' : 'Kirim'}
                </button>
            </div>
        </div>
    )
}
