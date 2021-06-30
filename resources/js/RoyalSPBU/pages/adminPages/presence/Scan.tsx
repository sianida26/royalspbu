//referensi qr code scanner : https://github.com/zbar-wasm/demo/blob/master/src/index.js

import React from 'react'
import { render } from 'react-dom'
import {scanImageData, Symbol} from 'zbar.wasm'


export default function Scan() {

    const [isScanning, setScanning] = React.useState(true)
    const [qrValue, setQrValue] = React.useState('')
    const videoElement = React.useRef<HTMLVideoElement>(null)
    const canvasElement = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        main()
    },[])

    React.useLayoutEffect(() => {
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize',handleResize)
    }, [])

    const handleResize = () => {
        const width = document.documentElement.clientWidth
        const height = document.documentElement.clientHeight
        videoElement.current!.width = width
        videoElement.current!.height = height
        canvasElement.current!.width = videoElement.current!.videoWidth
        canvasElement.current!.height = videoElement.current!.videoHeight

        if (width / videoElement.current!.videoWidth < height / videoElement.current!.videoHeight){
            canvasElement.current!.style.width = '100vw'
            canvasElement.current!.style.height = 'auto'
        } else {
            canvasElement.current!.style.width = 'auto'
            canvasElement.current!.style.height = '100vh'
        }
    }

    const main = async () => {

        const sleep = (ms: number) => new Promise(r => setTimeout(r,ms))

        try{
            await init()
            while (isScanning){
                await scan()
                await sleep(800)
            }
        } catch (e){
            console.log('error get camera: '+e)
            console.error(e)
        }
    }

    const init = async () => {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'environment',
                width: { max: 640 },
                height: { min: 640 },
            }
        })

        videoElement.current!.srcObject = mediaStream
        videoElement.current!.setAttribute('playsinline', '')
        videoElement.current!.play()
        await new Promise(r => videoElement.current!.onloadedmetadata = r)
        handleResize()
    }

    const scan = async () => {
        const width = videoElement.current!.videoWidth
        const height = videoElement.current!.videoHeight
        canvasElement.current!.width = width
        canvasElement.current!.height = height

        const context: CanvasRenderingContext2D | null = canvasElement.current!.getContext('2d')
        context?.drawImage(videoElement.current!, 0, 0, width, height)
        const imgData = context?.getImageData(0, 0, width, height)
        const res = await scanImageData(imgData!)
        render(res)
    }

    const render = (symbols: Symbol[]) => {
        const context = canvasElement.current?.getContext('2d')
        if (context == null || context == undefined){
            console.log('context in render is null!')
            return
        }
        const width = canvasElement.current!.width
        const height = canvasElement.current!.height
        context.clearRect(0,0,width,height)
        for (let i = 0; i < symbols.length; ++i){
            const sym = symbols[i]
            const points = sym.points
            context.beginPath()
            for (let j = 0; j < points.length; ++j){
                const {x, y} = points[j]
                if (j == 0) context.moveTo(x, y)
                else context.lineTo(x,y)
            }
            context.closePath()
            context.stroke()
            context.fillText('#' + i,points[0].x, points[0].y - 10)
            // setQrValue(sym.decode())
            console.log('horee'+sym.decode())
        }
    }

    return (
        <div>
            <video className="tw-block tw-absolute" ref={videoElement}></video>
            <canvas ref={canvasElement} className="tw-block tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-bottom-0 tw-m-auto"></canvas>
        </div>
    )
}
