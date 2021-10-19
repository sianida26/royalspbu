import React from 'react'

import {useHistory} from 'react-router'
import {formatRupiah, numberWithCommas} from '../../../../utils/helper'

import { useAuth } from '../../../../providers/AuthProvider'
import { useAdminConfig } from '../../../../providers/AdminConfigProvider'
import AdminHeaderSidebar from '../../../../components/AdminHeaderSidebar'
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
            <AdminHeaderSidebar title="Laporan Pompa Harian" />
            <div className="tw-flex tw-flex-col tw-px-4 tw-w-full tw-mt-2">
                <p>Pelapor: <span className="tw-font-semibold">{report.reporter}</span></p>
                <p>Hari, Tanggal: <span className="tw-font-semibold">{report.createdAt}</span></p>
                {/* <p className="tw-text-center">Laporan Pulau Pompa {report.pump.pumpNumber}</p>
                {
                    report.pump.nozzles.map((nozzle,i) => {
                        const totalizatorDiff = Math.abs(nozzle.totalizator - nozzle.initialTotalizator)
                        return (
                            <div className="tw-border tw-border-black tw-flex tw-flex-col tw-p-2" key={i}>
                                <p>Nozzle {i+1}</p>
                                <p>Nama Produk: {nozzle.productName}</p>
                                <p>Totalisator Awal: {nozzle.initialTotalizator}</p>
                                <p>Totalisator Akhir: {nozzle.totalizator}</p>
                                <p>Volume Penjualan: {totalizatorDiff}</p>
                                <p>Harga per liter: Rp.{nozzle.price}</p>
                                <p>Total Pendapatan: Rp. {nozzle.price*totalizatorDiff}</p>
                                <p>Bukti Foto</p>
                                <img src={`/storage/images/reports/${nozzle.reportFilename}`} />
                            </div>
                        )
                    })
                }
                <p>Total Pendapatan: {report.income}</p> */}
                <div 
                    className="tw-flex tw-flex-col tw-max-w-screen-sm tw-w-full tw-items-center tw-justify-center tw-mt-2 tw-px-5 tw-py-5 tw-bg-white tw-rounded-xl tw-gap-4"
                    style={{boxShadow: '2px 3px 4px rgba(0, 0, 0, 0.25)', borderRadius: '12px'}}
                >
                    <p className="tw-font-semibold tw-text-gray-500 tw-text-xl">Laporan Pulau Pompa {report.pump.pumpNumber}</p>
                    {report.pump.nozzles.map((nozzle, i) => 
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
                                    <img src={`/storage/images/reports/${nozzle.reportFilename}`} alt="Bukti Laporan" className="tw-max-w-full" />
                                </div>
                            </div>
                        })
                    }


                    <div className="tw-flex tw-flex-col tw-w-full tw-bg-gray-100 tw-py-4 tw-px-2 tw-rounded-lg">
                        <p className="tw-text-center tw-text-xl tw-font-bold tw-mb-2">Total Pendapatan Pompa {report.pump.pumpNumber}</p>
                        {
                            report.pump.nozzles.map((nozzle, i) => {

                                return <div key={i} className="tw-flex tw-gap-2">
                                    <div className="tw-w-20">Nozzle {i+1}</div>
                                    <div className="">:</div>
                                    <div className="tw-font-semibold">{formatRupiah(nozzle.getRevenue())}</div>
                                </div>
                            })
                        }
                        <div className="tw-mt-4 tw-w-full tw-rounded-lg tw-bg-white tw-py-4 tw-px-2 tw-flex tw-flex-col tw-items-center">
                            <span className="tw-text-xl">Total pendapatan</span>
                            <span className="tw-text-green-600 tw-font-extrabold tw-text-3xl">{formatRupiah(report.getRevenue())}</span>
                        </div>
                    </div>
                {
                    isToday(new Date(report.createdAt)) && <button className="tw-w-full tw-py-2 tw-text-center tw-bg-green-300">Izinkan edit</button>
                }
                {/* <button className="tw-w-full tw-py-2 tw-text-center tw-bg-blue-300" onClick={() => window.location.href = '/tests/testPDF'}>Download PDF</button> */}
                </div>
            </div>
        </div>
    )
}
