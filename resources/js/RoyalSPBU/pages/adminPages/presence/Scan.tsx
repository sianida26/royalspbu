//referensi qr code scanner : https://github.com/zbar-wasm/demo/blob/master/src/index.js

import React from 'react'
import { render } from 'react-dom'
import {scanImageData, Symbol} from 'zbar.wasm'
import { useUserMedia } from '../../../hooks/useUserMedia'


const CAPTURE_OPTIONS = {
    audio: false,
    video: {
        facingMode: 'environment',
        width: { max: 640 },
        height: { min: 640 },
    }
}

export default function Scan() {
    const [qrValue, setQrValue] = React.useState('')
    const videoElement = React.useRef<HTMLVideoElement>(null)
    const canvasElement = React.useRef<HTMLCanvasElement>(null)
    const scannerContainer = React.useRef<HTMLDivElement>(null)

    const mediaStream = useUserMedia(CAPTURE_OPTIONS)

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
                const sym = symbols[0]
                setQrValue(sym.decode())
            }   
        }
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
                <button>Cek</button>
            </div>
            <hr className="tw-border-b tw-border-black mt-2" />
            <span>Presensi berhasil</span>
            <span>Nama: Belum</span>
            <span>Waktu presensi: belum diprogram</span>
        </div>
    )
}
