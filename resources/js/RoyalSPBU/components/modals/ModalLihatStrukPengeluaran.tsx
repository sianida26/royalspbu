import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import zIndexes from '../../constants/zIndexes'

interface ComponentProps {
    show: boolean
    url: string
    handleClose: () => void
}

export default function ModalLihatStrukPengeluaran(props: ComponentProps) {
    return (
        <div style={{zIndex: zIndexes.modalBackdrop}} className={`tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-h-screen tw-p-4 ${props.show ? 'tw-grid' : 'tw-hidden'} tw-place-items-center tw-bg-black tw-bg-opacity-75`}>
            <PerfectScrollbar className="tw-w-screen tw-h-screen tw-grid tw-place-items-center tw-p-4">
                <div className="tw-max-w-lg tw-w-full tw-bg-white tw-rounded-2xl tw-p-6 tw-flex tw-flex-col">

                    {/* for close button */}
                    <div className="tw-w-full tw-flex tw-justify-end">
                        <i className="bi bi-x-lg tw-text-xl" onClick={props.handleClose} />
                    </div>
                    {
                        props.url ? <img className="" src={props.url} alt="Bukti pembayaran"  /> : "Tidak ada struk"
                    }
                </div>
            </PerfectScrollbar>
        </div>
    )
}
