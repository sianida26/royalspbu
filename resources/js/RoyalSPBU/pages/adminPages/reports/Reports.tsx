import React from 'react'
import { useHistory } from 'react-router'

export default function Reports() {

    const history = useHistory()

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-p-2">
            <p>Laporan</p>
            <div className="tw-w-full tw-border tw-border-black tw-py-8" onClick={() => history.push('/laporan/pompa-harian') }>
                Laporan pompa harian
            </div>
        </div>
    )
}
