import React from 'react'

import { useSnackbar } from 'notistack'

// import Pump from '../../../models/Pump'
// import Nozzle from '../../../models/Nozzle'

import { useAuth } from '../../../providers/AuthProvider'

import PilihPompa from './PilihPompa'
import IsiLaporan from './IsiLaporan'

//TODO REFACTOR. This page needs so much refactoring

//TODO buat alert kalau file tidak bisa diupload karena offline

enum StepLaporan {
    PilihPompa,
    IsiLaporan,
    PeriksaLaporan,
}

export enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

export interface Pump {
    id: number, //Pump id
    available: boolean, //is available for reporting (unavailable if already reported)
    nozzles: {
        id: number, //nozzle id
        initialTotalizator: number, //inital totalizator
        price: number, //price per litre
        productName: string, //product name
    }[]
}

export interface Report extends Pump {
    nozzles: {
        id : number,
        finalTotalizator: number,
        imageUrl: string,
        initialTotalizator: number,
        price : number,
        productName : string,
        reportFilename: string,
        uploadErrorMsg: string,
        uploadProgress : number,
        uploadStatus: UploadStatus,
    }[]
}

const defaultPumpObj = {
    id: -1,
    available: false,
    nozzles: []
}

export default function Laporan() {

    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const [step, setStep] = React.useState(StepLaporan.PilihPompa)
    const [report, setReport] = React.useState<Report>(defaultPumpObj)
    const [isLoading, setLoading] = React.useState(true)
    const [pumps, setPumps] = React.useState<Pump[]>([])
    // const selectedPump = React.useRef<Pump>(defaultPumpObj)

    React.useEffect(() => {
        requestAvailablePumps()
    }, [])

    const requestAvailablePumps = () => {
        setLoading(true)
        axios({method: 'get', url: '/getAvailablePumps'})
        .then((response) => {
            let data: Pump[] = response.data
            setPumps(data)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    const handlePilihPompa = (pump: Pump) => {
        setReport({
            ...pump,
            nozzles: pump.nozzles.map(nozzle => ({
                    ...nozzle,
                    finalTotalizator: 0,
                    imageUrl: '',
                    reportFilename: '',
                    uploadErrorMsg: '',
                    uploadProgress : -1,
                    uploadStatus: UploadStatus.NONE,
                }))
        })
        setStep(StepLaporan.IsiLaporan)
    }

    const handleSubmitIsi = (pump: Pump) => {
        //cek apakah sudah terisi semua
        // selectedPump.current = pump
        // let anyEmpty = pump.nozzles.some(nozzle => (nozzle.data.finalTotalizator == undefined || nozzle.data.reportFilename == ""))
        // if (anyEmpty) enqueueSnackbar('Anda harus mengisi semua masukan untuk melanjutkan',{variant: 'error'})
        // else setStep(StepLaporan.PeriksaLaporan)
        alert('belum diprogram')
    }

    const renderPilihPompa = () => {
        return isLoading? <div>Loading...</div>
        : <PilihPompa pumps={pumps} handlePilihPompa={(pump) => handlePilihPompa(pump)} />
    }

    const renderIsiLaporan = () => {
        return <IsiLaporan report={report} handleSubmitIsi={(report) => handleSubmitIsi(report)} />
    }

    const renderPeriksaLaporan = () => {
        // return (
        //     <div className="tw-flex tw-flex-col tw-gap-2">
        //         <p className="tw-text-center">Laporan pulau pompa {report.pump}</p>
        //         {/* {
        //             Object.entries(report.nozzles).map(([nozzle, totalisator]) => (
        //                 <p>nozzle {nozzle} : {totalisator}</p>
        //             ))
        //         } */}
        //         {
        //             selectedPump.current.nozzles.map((nozzle, i) => {

        //                 return (<div className="tw-w-full tw-flex tw-flex-col tw-border tw-p-2 tw-border-black" key={nozzle.id}>
        //                     <p className="tw-text-center tw-font-bold">Nozzle {i+1}</p>
        //                     <p>Nama Produk: {nozzle.data.productName}</p>
        //                     <p>Totalisator Awal: {nozzle.data.initialTotalizator} L</p>
        //                     <p>Totalisator AKhir: {nozzle.data.finalTotalizator} L</p>
        //                     <p>Volume penjualan: {nozzle.totalizatorDifference} L</p>
        //                     <p>Harga per liter: Rp{nozzle.data.price}</p>
        //                     <p>Total pendapatan: Rp{nozzle.data.price*nozzle.totalizatorDifference}</p>
        //                     <p>Bukti foto</p>
        //                 </div>
        //             )})
        //         }
        //         {/* <button className="tw-border tw-bg-gray-400" onClick={handleSubmitIsi}>Kirim</button> */}
        //     </div>
        // )
    }

    return (
        <div className="tw-max-w-screen tw-w-full">
            <p className="tw-text-center">
                {
                    step === StepLaporan.PilihPompa ? 'Pilih Pompa' : 
                    step === StepLaporan.IsiLaporan ? 'Isi Laporan' : 'Periksa Laporan'
                }
            </p>
            {
                step === StepLaporan.PilihPompa ? renderPilihPompa() :
                step === StepLaporan.IsiLaporan ? renderIsiLaporan() : renderPeriksaLaporan()
            }
        </div>
    )
}
