import React from 'react'

import { useHistory } from 'react-router-dom'

export default function Home() {

    let history = useHistory()

    return (
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-3">
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/user') }>
                List User
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/products')}>
                Produk
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/tanks')}>
                Tangki
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/pompa')}>
                Pulau Pompa
            </div>
        </div>
    )
}
