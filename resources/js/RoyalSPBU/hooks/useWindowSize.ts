import {
    useLayoutEffect,
    useState,
} from 'react'

export default function useWindowSize(){

    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    })

    useLayoutEffect(() => {

        const updateSize = () => setDimensions({
            height: window.innerHeight,
            width: window.innerWidth,
        })

        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])
    return dimensions
}