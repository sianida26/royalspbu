import React from 'react'
import { useHistory } from 'react-router'

export default function Home() {

    const history = useHistory()

    const handleAbsenClick = () => {
        history.push('/absen')
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-8">
            <div className="tw-p-8 tw-border tw-border-black" onClick={handleAbsenClick}>
                <span>Absen</span>
            </div>

            <div className="tw-p-8 tw-border tw-border-black">
                <span>Laporan</span>
            </div>
        </div>
    )
}
