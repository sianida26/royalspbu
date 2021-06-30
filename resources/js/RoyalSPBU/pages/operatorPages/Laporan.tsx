import React, {useState} from 'react'

enum StepLaporan {
    PilihPompa,
    IsiLaporan,
    PeriksaLaporan,
}

interface INozzles {
    [x: number] : number
}

interface IReport {
    pompa: number
    nozzles: INozzles
}

export default function Laporan() {

    const [step, setStep] = useState(StepLaporan.PilihPompa)
    const [report, setReport] = useState<IReport>({
        pompa: -1,
        nozzles: {}
    })

    const handlePilihPompa = (pilihanPompa: number) => {
        setReport({
            pompa: pilihanPompa,
            nozzles: {},
        })
        setStep(StepLaporan.IsiLaporan)
    }

    const handleSubmitIsi = () => {
        setStep(StepLaporan.PeriksaLaporan)
    }

    const handleInputTotalisator = (input: string, nozzle: number) => {
        setReport(prev => {
            return {
                ...prev,
                nozzles : {
                    ...prev.nozzles,
                    [nozzle] : +input
                }
            }
        })
    }

    const renderPilihPompa = () => {
        return (
            <div className="tw-grid tw-grid-cols-2 tw-w-full tw-gap-8">
                {[1,2,3,4].map(x => <div 
                    key={x} 
                    onClick={() => handlePilihPompa(x)}
                    className="tw-w-24 tw-h-24 tw-border tw-border-black">{`pulau pompa ${x}`}</div>)}
            </div>
        )
    }

    const renderIsiLaporan = () => {
        return (
            <div className="tw-flex tw-flex-col tw-gap-2">
                {[1,2,3,4].map(x => <div key={x}>
                    <p>Totalisator Nozzle {x}</p>
                    <input type="number" onChange={(e) => handleInputTotalisator(e.target.value, x)} className="tw-border tw-border-black tw-p-2" />
                </div>)}
                <button className="tw-border tw-bg-gray-400" onClick={handleSubmitIsi}>Selanjutnya</button>
            </div>
        )
    }

    const renderPeriksaLaporan = () => {
        return (
            <div className="tw-flex tw-flex-col tw-gap-2">
                <p className="tw-text-center">Laporan pulau pompa {report.pompa}</p>
                {
                    Object.entries(report.nozzles).map(([nozzle, totalisator]) => (
                        <p>nozzle {nozzle} : {totalisator}</p>
                    ))
                }
                <button className="tw-border tw-bg-gray-400" onClick={handleSubmitIsi}>Kirim</button>
            </div>
        )
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
