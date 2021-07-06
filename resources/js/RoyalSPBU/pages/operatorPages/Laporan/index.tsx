import React from 'react'

import { useSnackbar } from 'notistack'

// import Pump from '../../../models/Pump'
// import Nozzle from '../../../models/Nozzle'

import { useAuth } from '../../../providers/AuthProvider'

import PilihPompa from './PilihPompa'
import IsiLaporan from './IsiLaporan'
import PeriksaLaporan from './PeriksaLaporan'

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
    pumpNumber: number,
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
    pumpNumber: -1,
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

    const handlePilihPompa = (pump: Pump, n: number) => {
        setReport({
            ...pump,
            pumpNumber: n,
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

    const handleSubmitIsi = (pump: Report) => {
        // cek apakah sudah terisi semua
        // selectedPump.current = pump
        let anyEmpty = pump.nozzles.some(nozzle => (nozzle.finalTotalizator == undefined || nozzle.reportFilename == ""))
        if (anyEmpty) enqueueSnackbar('Anda harus mengisi semua masukan untuk melanjutkan',{variant: 'error'})
        else {
            setReport(pump)
            setStep(StepLaporan.PeriksaLaporan)
        }
    }

    const handleBackToPilihPompa = () => {
        setStep(StepLaporan.PilihPompa)
    }

    const handleBackToIsiLaporan = () => {
        setStep(StepLaporan.IsiLaporan)
    }

    const renderPilihPompa = () => {
        return isLoading? <div>Loading...</div>
        : <PilihPompa pumps={pumps} handlePilihPompa={(pump, n) => handlePilihPompa(pump, n)} />
    }

    const renderIsiLaporan = () => {
        return <IsiLaporan report={report} handleSubmitIsi={(report) => handleSubmitIsi(report)} handleBack={() => handleBackToPilihPompa()} />
    }

    const renderPeriksaLaporan = () => {
        return <PeriksaLaporan report={report} handleBack={() => handleBackToIsiLaporan()} />
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
