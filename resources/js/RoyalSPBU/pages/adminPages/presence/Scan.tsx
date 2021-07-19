//referensi qr code scanner : https://github.com/zbar-wasm/demo/blob/master/src/index.js

import React from 'react'
import { render } from 'react-dom'
import {scanImageData, Symbol} from 'zbar.wasm'
import { useAuth } from '../../../providers/AuthProvider'
import { useSnackbar } from 'notistack'
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
    const {enqueueSnackbar} = useSnackbar()
    const mediaStream = useUserMedia(CAPTURE_OPTIONS)
    const {axios} = useAuth()

    // const beep = require('../../../assets/store-scanner-beep.mp3')

    const [qrValue, setQrValue] = React.useState('')
    const videoElement = React.useRef<HTMLVideoElement>(null)
    const canvasElement = React.useRef<HTMLCanvasElement>(null)
    const scannerContainer = React.useRef<HTMLDivElement>(null)
    let audio = new Audio('/storage/assets/store-scanner-beep.mp3')

    const [scanResult, setScanResult] = React.useState<ScanResult>({
        status: ScanStatus.INIT,
        name: '-',
        timestamp: '-'
    })


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
            console.log('error get camera: '+e)
            console.error(e)
        }
    }

    const handleCanPlay = () => {
        videoElement.current!.play()
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

    const handleCheck = () => {
        sendToken(qrValue)
    }

    const sendToken = (token: string) => {
        axios({url: '/admin/presence/scan', method: 'post', data: {token}})
        .then((result) => {
            console.log(result)
            // let data: ScanResult = result.data
            setScanResult({
                status: ScanStatus.SUCCESS,
                name: result.data.name,
                timestamp: result.data.timestamp,
            })
        })
        .catch(error =>{ //handle error response
            setScanResult({status: ScanStatus.ERROR})
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.request){
                //Request was made but no response was received
            } else if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 404: errorMessage = "Kode tidak valid"; break;
                }
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            //you can show error notification here
            // enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    return (
        <div className="tw-flex tw-flex-col tw-w-full tw-px-4">
            <p className="tw-text-right">Tanggal sekarang</p>
            <div className="tw-w-full relative" ref={scannerContainer}>
                <video className="tw-block tw-transform" onCanPlay={handleCanPlay} style={{transform: 'rotateY(180deg)', WebkitTransform: 'rotateY(180deg)'}} ref={videoElement} muted autoPlay playsInline></video>
                <canvas ref={canvasElement} className="tw-hidden tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0 tw-m-auto"></canvas>
            </div>
            <div className="">
                <p>Presensi Manual</p>
                <input className="tw-border tw-border-black tw-p-1" value={qrValue} onChange={(e) => setQrValue(e.target.value)} />
                <button onClick={handleCheck}>Cek</button>
            </div>
            <hr className="tw-border-b tw-border-black mt-2" />
            {
                scanResult.status === ScanStatus.SUCCESS ? <div className="tw-flex tw-flex-col">
                    <span>Presensi berhasil</span>
                    <span>Nama: {scanResult.name}</span>
                    <span>Waktu presensi: {scanResult.timestamp}</span>
                </div>
                : scanResult.status === ScanStatus.ERROR && <p className="tw-text-red">Kode tidak valid</p>
            }
        </div>
    )
}
