import React from 'react'
import { useHistory } from 'react-router'

import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

export default function Reports() {

    const history = useHistory()

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Laporan Harian" />
            <div className="tw-w-full tw-flex tw-flex-col tw-p-4 tw-gap-4">
                <button 
                    className="tw-w-full tw-bg-orange-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center" 
                    onClick={() => history.push('/laporan/pompa-harian') }
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    Laporan Pompa Harian
                </button>
                <div 
                    className="tw-w-full tw-bg-green-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center"
                    onClick={() => history.push('/laporan/totalisator-harian')}
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    Laporan Totalisator Harian
                </div>
                <div 
                    className="tw-w-full tw-bg-primary-600 tw-text-white tw-rounded-lg tw-py-8 tw-font-medium tw-text-lg tw-grid tw-place-content-center"
                    onClick={() => history.push('/laporan/persediaan')}
                    style={{boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.25)"}}
                >
                    Laporan Persediaan BBM
                </div>
            </div>
        </div>
    )
}
