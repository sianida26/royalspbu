import React from 'react'
import AdminHeaderSidebar from '../../components/AdminHeaderSidebar'

import { useHistory } from 'react-router-dom'

export default function Home() {

    let history = useHistory()

    return (
        <div className="tw-flex tw-w-full tw-flex-col tw-gap-3">
            <AdminHeaderSidebar title="Home" />
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/user') }>
                List User
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/presensi') }>
                Presensi
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
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/laporan')}>
                Laporan Harian
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/laporan-bulanan')}>
                Laporan Bulanan
            </div>
            <div className="tw-py-8 tw-border tw-border-black" onClick={() => history.push('/penerimaan')}>
                Penerimaan
            </div>
        </div>
    )
}
