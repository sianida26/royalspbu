//referensi qr code scanner : https://github.com/zbar-wasm/demo/blob/master/src/index.js

import React from 'react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useSnackbar } from 'notistack'
import {scanImageData, Symbol} from 'zbar.wasm'

import {
    IconButton,
    TextField,
} from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'

import { useAuth } from '../../../providers/AuthProvider'
import { useUserMedia } from '../../../hooks/useUserMedia'

enum ScanStatus {
    INIT,
    SUCCESS,
    ERROR
}

interface ScanResult {
    status: ScanStatus,
    name?: string,
    timestamp?: string,
}

const CAPTURE_OPTIONS = {
    audio: false,
    video: {
        facingMode: 'environment',
        width: { max: 640 },
        height: { min: 640 },
    }
}

export default function Scan() {

    const audio = new Audio('/storage/assets/store-scanner-beep.mp3')

    const mediaStream = useUserMedia(CAPTURE_OPTIONS)
    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [errorMessage, setErrorMessage] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)
    const [qrValue, setQrValue] = React.useState('')

    const [scanResult, setScanResult] = React.useState<ScanResult>({
        status: ScanStatus.INIT,
        name: '-',
        timestamp: '-'
    })

    const canvasElement = React.useRef<HTMLCanvasElement>(null)
    const scannerContainer = React.useRef<HTMLDivElement>(null)
    const videoElement = React.useRef<HTMLVideoElement>(null)



    if (mediaStream && videoElement.current && videoElement.current.srcObject === null) {
        videoElement.current.srcObject = mediaStream
    }

    React.useEffect(() => {
        main()
    },[])

    React.useLayoutEffect(() => {
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize',handleResize)
    }, [])

    const handleCanPlay = () => {
        videoElement.current!.play()
    }

    const handleCheck = () => {
        sendToken(qrValue)
    }

    const handleResize = () => {
        const width = scannerContainer.current!.clientWidth
        const height = scannerContainer.current!.clientHeight
        videoElement.current!.width = width
        videoElement.current!.height = height
        canvasElement.current!.width = videoElement.current!.videoWidth
        canvasElement.current!.height = videoElement.current!.videoHeight

        if (width / videoElement.current!.videoWidth < height / videoElement.current!.videoHeight){
            canvasElement.current!.style.width = '100%'
            canvasElement.current!.style.height = 'auto'
        } else {
            canvasElement.current!.style.width = 'auto'
            canvasElement.current!.style.height = '100%'
        }
    }

    const main = async () => {

        const sleep = (ms: number) => new Promise(r => setTimeout(r,ms))

        try{
            while (true){
                if (videoElement.current){
                    await scan()
                }
                await sleep(100)
            }
        } catch (e){
            setErrorMessage(`Gagal mengakses kamera (${e}}`)
            setScanResult({status: ScanStatus.ERROR})
            console.error(e)
        }
    }

    const scan = async () => {
        const sleep = (ms: number) => new Promise(r => setTimeout(r,ms))
        const width = videoElement.current!.videoWidth
        const height = videoElement.current!.videoHeight
        canvasElement.current!.width = width
        canvasElement.current!.height = height

        if (canvasElement.current && canvasElement.current.width > 0){
            const context: CanvasRenderingContext2D | null = canvasElement.current!.getContext('2d')
            context?.drawImage(videoElement.current!, 0, 0, width, height)
            const imgData = context?.getImageData(0, 0, width, height)
            const symbols = await scanImageData(imgData!)
            if (symbols.length > 0){
                audio.play()
                const sym = symbols[0]
                let token = sym.decode()
                setQrValue(token)
                sendToken(token)
                await sleep(1000) //add delay after scanning
            }   
        }
    }

    const sendToken = (token: string) => {
        setLoading(true)
        axios({url: '/admin/presence/scan', method: 'post', data: {token}})
        .then((result) => {
            setErrorMessage('')
            // let data: ScanResult = result.data
            setScanResult({
                status: ScanStatus.SUCCESS,
                name: result.data.name,
                timestamp: result.data.timestamp,
            })
        })
        .catch(error =>{ //handle error response
            setScanResult({status: ScanStatus.ERROR})
            let errorMsg = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 404: errorMsg = "Kode tidak valid"; break;
                }
                setErrorMessage(errorMsg)
            } else if (error.response){
                //Request was made but no response was received
                setErrorMessage(errorMsg)                
            } else {
                setErrorMessage(errorMsg)
            }
            //you can show error notification here
            // enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="tw-flex tw-flex-col tw-w-full tw-px-4">
            <p className="tw-text-right tw-mt-2">{format(new Date(), 'EEEE, dd LLLL yyyy', {locale: localeId})}</p>
            <div className="tw-w-full relative" ref={scannerContainer}>
                <video className="tw-block tw-transform" onCanPlay={handleCanPlay} style={{transform: 'rotateY(180deg)', WebkitTransform: 'rotateY(180deg)'}} ref={videoElement} muted autoPlay playsInline></video>
                <canvas ref={canvasElement} className="tw-hidden tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0 tw-m-auto"></canvas>
            </div>
            <form 
                className="tw-mt-2 tw-flex tw-items-center tw-gap-2"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleCheck()
                }}
            >
                <TextField 
                    disabled={isLoading}
                    label="Presensi Manual"
                    onChange={(event) => setQrValue(event.target.value)}
                    value={qrValue}
                    variant="outlined"
                />
                <IconButton 
                    aria-label="Cari" 
                    color="primary"
                    disabled={isLoading}
                    type="submit"
                >
                    <SearchIcon />
                </IconButton>
            </form>
            {/* <hr className="tw-border-b tw-border-black mt-2" /> */}
            {
                scanResult.status === ScanStatus.SUCCESS ? <div className="tw-flex tw-items-center tw-w-full tw-mt-4 tw-rounded-md tw-shadow-md tw-bg-gray-50 tw-p-3 tw-relative">
                    <span className="tw-absolute tw-left-0 tw-top-0 tw-rounded-l-md tw-h-full tw-w-1 tw-bg-green-500"></span>
                    <div className="tw-flex tw-items-center tw-justify-center">
                        <span className="tw-w-8 tw-h-8 tw-mx-2 tw-rounded-full tw-bg-green-500 tw-flex tw-items-center tw-justify-center">
                            <i className="bi bi-check2 tw-text-white tw-mx-4" />
                        </span>
                    </div>
                    <div className="tw-flex-grow tw-flex tw-flex-col tw-ml-1">
                        <span className="tw-font-semibold">Presensi berhasil</span>
                        <span>{scanResult.name}</span>
                        <span className="tw-absolute tw-top-2 tw-right-2 tw-text-sm tw-text-gray-600">{scanResult.timestamp}</span>
                    </div>
                </div>
                : scanResult.status === ScanStatus.ERROR && <div className="tw-flex tw-items-center tw-w-full tw-mt-4 tw-rounded-md tw-shadow-md tw-bg-gray-50 tw-p-3 tw-relative">
                    <span className="tw-absolute tw-left-0 tw-top-0 tw-rounded-l-md tw-h-full tw-w-1 tw-bg-red-500"></span>
                    <div className="tw-flex tw-items-center tw-justify-center">
                        <span className="tw-w-8 tw-h-8 tw-mx-2 tw-rounded-full tw-bg-red-500 tw-flex tw-items-center tw-justify-center">
                            <i className="bi bi-x-lg tw-text-white" />
                        </span>
                    </div>
                    <div className="tw-flex-grow tw-flex tw-flex-col tw-ml-1">
                        <span className="tw-font-semibold">Terjadi Kesalahan</span>
                        <span>{errorMessage}</span>
                    </div>
                </div>
            }
        </div>
    )
}
