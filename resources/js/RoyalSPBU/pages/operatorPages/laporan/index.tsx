import React from 'react'

import { useSnackbar } from 'notistack'
import { useConfig } from '../../../providers/ConfigProvider'

import { useAuth } from '../../../providers/AuthProvider'

import PilihPompa from './PilihPompa'
import IsiLaporan from './IsiLaporan'
import PeriksaLaporan from './PeriksaLaporan'

import {
    Step,
    Stepper,
    StepLabel,
} from '@material-ui/core'

import OperatorHeader from '../../../components/OperatorHeader'

import Pump from '../../../models/Pump'
import DailyPumpReport from '../../../models/DailyPumpReport'
import Nozzle from '../../../models/Nozzle'

enum StepLaporan {
    PilihPompa = 0,
    IsiLaporan = 1,
    PeriksaLaporan = 2,
}

export enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

interface PumpFromServer {
    available: boolean,
    id: number,
    nozzles: {
        id: number,
        initialTotalizator: number,
        price: number,
        productName: string,
    }[]
}

const getSteps = () => ['Pilih Pompa', 'Isi Laporan', 'Periksa Laporan']

export default function Laporan() {

    const steps = getSteps()

    const {axios} = useAuth()
    const {configs} = useConfig()
    const {enqueueSnackbar} = useSnackbar()

    const [currentStep, setCurrentStep] = React.useState(StepLaporan.PilihPompa)
    const [isLoading, setLoading] = React.useState(true)
    const [pumps, setPumps] = React.useState<Pump[]>([])
    const [report, setReport] = React.useState<DailyPumpReport>(new DailyPumpReport())

    React.useEffect(() => {
        if (configs.editReport.isDefined()) {
            setReport(configs.editReport)
            setCurrentStep(StepLaporan.IsiLaporan)
        } else {
            requestAvailablePumps()
        }
    }, [])

    React.useEffect(() => {
        if (configs.editReport.isDefined() && currentStep === StepLaporan.PilihPompa) {
            setCurrentStep(StepLaporan.IsiLaporan)   
        }
    }, [currentStep])

    const requestAvailablePumps = () => {
        setLoading(true)
        axios({method: 'get', url: '/getAvailablePumps'})
        .then((response) => {
            let data: PumpFromServer[] = response.data
            setPumps(data.map((x,i) => {

                let nozzles = x.nozzles.map(nozzle => {
                    let nozzleModel =  new Nozzle({
                        id: nozzle.id,
                        initialTotalizator: nozzle.initialTotalizator,
                    })
                    nozzleModel.price = nozzle.price
                    nozzleModel.productName = nozzle.productName
                    return nozzleModel
                }) 

                return new Pump({
                    available: x.available,
                    id: x.id,
                    nozzles: nozzles,
                    pumpNumber: i+1,
                })
            }))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    const handlePilihPompa = (pump: Pump) => {
        setReport(new DailyPumpReport({pump}))
        setCurrentStep(StepLaporan.IsiLaporan)
    }

    const handleSubmitIsi = (newReport: DailyPumpReport) => {
        setReport(newReport)
        setCurrentStep(StepLaporan.PeriksaLaporan)
    }

    const handleBackToPilihPompa = () => {
        setCurrentStep(StepLaporan.PilihPompa)
    }

    const handleBackToIsiLaporan = () => {
        setCurrentStep(StepLaporan.IsiLaporan)
    }

    const renderPilihPompa = () => {
        return isLoading? <div>Loading...</div>
        : <PilihPompa pumps={pumps} handlePilihPompa={(pump) => handlePilihPompa(pump)} />
    }

    const renderIsiLaporan = () => {
        return <IsiLaporan report={report} handleSubmitIsi={(report) => handleSubmitIsi(report)} handleBack={() => handleBackToPilihPompa()} />
    }

    const renderPeriksaLaporan = () => {
        return <PeriksaLaporan report={report} handleBack={() => handleBackToIsiLaporan()} />
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-screen tw-min-h-screen tw-bg-gray-100">

            <OperatorHeader title="Laporan" />

            {/* stepper */}
            <Stepper activeStep={currentStep} alternativeLabel style={{backgroundColor: 'transparent'}}>
                {
                    steps.map(step => <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>)
                }
            </Stepper>

            <div className="tw-flex-grow tw-px-4 tw-pb-4">
                {
                    currentStep === StepLaporan.PilihPompa ? renderPilihPompa() 
                    : currentStep === StepLaporan.IsiLaporan ? renderIsiLaporan() 
                    : currentStep === StepLaporan.PeriksaLaporan ? renderPeriksaLaporan()
                    : <div>Undefined step</div>
                }
            </div>
        </div>
    )
}
