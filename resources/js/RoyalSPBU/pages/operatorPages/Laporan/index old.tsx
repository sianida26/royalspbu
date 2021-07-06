import React from 'react'

import { useSnackbar } from 'notistack'
import Compressor from 'compressorjs'

import { useAuth } from '../../../providers/AuthProvider'

//TODO REFACTOR. This page needs so much refactoring

//TODO buat alert kalau file tidak bisa diupload karena offline

enum StepLaporan {
    PilihPompa,
    IsiLaporan,
    PeriksaLaporan,
}

enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

interface INozzles {
    id: number,
    filename: string,
    totalizator: number
}

interface IReport {
    pump: number
    nozzles:
        {
            id: number,
            filename: string,
            totalizator: number | undefined,
        }[]
}

interface Pump {
    id: number, //Pump id
    available: boolean, //is available for reporting (unavailable if already reported)
    nozzles: {
        id: number, //nozzle id
        totalizator: number, //inital totalizator
        price: number, //price per litre
        product: string, //product name
    }[]
}

export default function Laporan() {

    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const [step, setStep] = React.useState(StepLaporan.PilihPompa)
    const [report, setReport] = React.useState<IReport>({
        pump: -1,
        nozzles: []
    })
    const [isLoading, setLoading] = React.useState(true)
    const [pumps, setPumps] = React.useState<Pump[]>([])
    const [selectedPump, setSelectedPump] = React.useState<Pump>({
        id: -1,
        available: false,
        nozzles: []
    })
    const [images, setImages] = React.useState<{id: number, url: string}[]>([])
    const [errorImages, setErrorImages] = React.useState<{id: number, error: string}[]>([])
    const [progressImages, setProgressImages] = React.useState<{id: number, status: UploadStatus, progress: number}[]>([])

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
        setSelectedPump(pump)
        setStep(StepLaporan.IsiLaporan)

        setReport({
            pump: pump.id,
            nozzles: pump.nozzles.map(nozzle => ({
                id: nozzle.id,
                filename: '',
                totalizator: undefined
            }))
        })
    }

    const handleSubmitIsi = () => {
        //cek apakah sudah terisi semua
        let anyEmpty = false
        report.nozzles.forEach(nozzle => {
            if (nozzle.totalizator == undefined || nozzle.filename == "") anyEmpty = true
        })
        if (anyEmpty) enqueueSnackbar('Anda harus mengisi semua masukan untuk melanjutkan',{variant: 'error'})
        else setStep(StepLaporan.PeriksaLaporan)
    }

    const handleInputTotalisator = (input: string, nozzleId: number) => {
        setReport(prev => {
            return {
                ...prev,
                nozzles: [
                    ...prev.nozzles.filter(x => x.id !== nozzleId),
                    {
                        id: nozzleId,
                        filename: prev.nozzles.find(({id}) => id === nozzleId)?.filename || '',
                        totalizator: +input
                    }
                ]
            }
        })
    }

    const handleChooseImage = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {

        if (event.target.files && event.target.files[0]){
            setImages(prev => [
                ...prev.filter(x => x.id !== id),
                {
                    id,
                    url: URL.createObjectURL(event.target.files![0])
                }
            ])

            setProgressImages(prev => [
                ...prev.filter(x => x.id !== id),
                {
                    id,
                    status : UploadStatus.COMPRESSING,
                    progress: 0,
                }
            ])

            new Compressor(event.target.files[0],{
                quality: 0.6,
                success(result){

                    //deletes error message for this file
                    setErrorImages(prev => [
                        ...prev.filter(x => x.id !== id)
                    ])

                    const formData = new FormData()

                    formData.append('image',result, 'image.jpeg')

                    axios({
                        method: 'post', 
                        url: '/uploadBuktiTotalizer', 
                        data: formData, 
                        onUploadProgress: (progressEvent) => {
                            setProgressImages(prev => [
                                ...prev.filter(x => x.id !== id),
                                {
                                    id,
                                    status : UploadStatus.UPLOADING,
                                    progress: (progressEvent.loaded/progressEvent.total)*100,
                                }
                            ])
                        }
                    })
                    .then(response => {
                        console.log(response)
                        setProgressImages(prev => [
                            ...prev.filter(x => x.id !== id),
                            {
                                id,
                                status : UploadStatus.UPLOADED,
                                progress: -1,
                            }
                        ])
                        setReport(prev => {
                            return {
                                ...prev,
                                nozzles: [
                                    ...prev.nozzles.filter(x => x.id !== id),
                                    {
                                        id: id,
                                        totalizator: prev.nozzles.find(({id: _id}) => _id === id)?.totalizator,
                                        filename: response.data
                                    }
                                ]
                            }
                        })
                    })
                    .catch(err => {
                        setProgressImages(prev => [
                            ...prev.filter(x => x.id !== id),
                            {
                                id,
                                status : UploadStatus.ERROR,
                                progress: -1,
                            }
                        ])
                        setErrorImages(prev => [
                            ...prev.filter(x => x.id !== id),
                            {
                                id,
                                error: err.response?.data?.errors?.image[0],
                            }
                        ])
                        console.log(err.response)
                    })
                },
                error(error){
                    console.log(error.message)
                    //add error message for this file
                    setErrorImages(prev => [
                        ...prev.filter(x => x.id !== id),
                        {
                            id,
                            error: 'File tidak bisa diproses'
                        }
                    ])

                    setProgressImages(prev => [
                        ...prev.filter(x => x.id !== id),
                        {
                            id,
                            status : UploadStatus.ERROR,
                            progress: -1,
                        }
                    ])
                }
            })
        }
    }

    const renderPilihPompa = () => {
        return isLoading? <div>Loading...</div>
        : pumps.length > 0 ? (
            <div className="tw-grid tw-grid-cols-2 tw-w-full tw-gap-8">
                {pumps.map((pump,i) => <div 
                    key={pump.id} 
                    onClick={() => handlePilihPompa(pump)}
                    className={`tw-w-24 tw-h-24 tw-border tw-border-black ${!pump.available && 'tw-bg-gray-400'}`}>{`pulau pompa ${i+1}`}</div>)}
            </div>
        ) : <div>Tidak ada pompa</div>
    }

    const renderIsiLaporan = () => {
        return (
            <div className="tw-flex tw-flex-col tw-gap-2">
                {selectedPump.nozzles.map((nozzle, i) => <div key={nozzle.id}>
                    <p className="tw-font-bold">Nozzle {i+1}</p>
                    <p>Nama Produk: {nozzle.product}</p>
                    <p>Totalisator Akhir</p>
                    <input type="number" value={report.nozzles.find(({id}) => id === nozzle.id)?.totalizator} onChange={(e) => handleInputTotalisator(e.target.value, nozzle.id)} className="tw-border tw-border-black tw-p-2" />
                    <img src={images.find(({id}) => id === nozzle.id)?.url} />
                    <input type="file" accept="images/*" onChange={(event) => handleChooseImage(event,nozzle.id)} />
                    {
                        progressImages.find(({id}) => id === nozzle.id)?.progress! >= 0 && (
                            <div className="tw-flex tw-flex-col tw-w-full">
                                <progress value={progressImages.find(({id}) => id === nozzle.id)?.progress} max={100}>{progressImages.find(({id}) => id === nozzle.id)?.progress}%</progress>
                                <p className="">{
                                    progressImages.find(({id}) => id === nozzle.id)?.status === UploadStatus.COMPRESSING ? 'Mengompres...'
                                    : 'Mengupload...'
                                }</p>
                            </div>
                        )
                    }
                    <p className="tw-text-red-500">{errorImages.find(({id}) => id === nozzle.id)?.error}</p>

                </div>)}
                <button className="tw-border tw-bg-gray-400" onClick={handleSubmitIsi}>Selanjutnya</button>
            </div>
        )
    }

    const renderPeriksaLaporan = () => {
        return (
            <div className="tw-flex tw-flex-col tw-gap-2">
                <p className="tw-text-center">Laporan pulau pompa {report.pump}</p>
                {/* {
                    Object.entries(report.nozzles).map(([nozzle, totalisator]) => (
                        <p>nozzle {nozzle} : {totalisator}</p>
                    ))
                } */}
                {
                    report.nozzles.map((nozzle, i) => {
                        
                        let serverNozzle = pumps.find(({id}) => id === report.pump)?.nozzles.find(({id}) => id === nozzle.id)
                        let totalisatorAwal = serverNozzle?.totalizator || 0
                        let totalisatorAkhir = nozzle.totalizator || 0
                        let selisihTotalisator = Math.abs(totalisatorAkhir - totalisatorAwal) 
                        let harga = serverNozzle?.price || 0

                        return (<div className="tw-w-full tw-flex tw-flex-col tw-border tw-p-2 tw-border-black" key={nozzle.id}>
                            <p className="tw-text-center tw-font-bold">Nozzle {i+1}</p>
                            <p>Nama Produk: {serverNozzle?.product}</p>
                            <p>Totalisator Awal: {totalisatorAwal} L</p>
                            <p>Totalisator AKhir: {totalisatorAkhir} L</p>
                            <p>Volume penjualan: {selisihTotalisator} L</p>
                            <p>Harga per liter: Rp{harga}</p>
                            <p>Total pendapatan: Rp{harga*selisihTotalisator}</p>
                            <p>Bukti foto</p>
                        </div>
                    )})
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
