import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface ComponentProps {
    show: boolean
    url: string
    handleClose: () => void
}

export default function ModalLihatStrukPengeluaran(props: ComponentProps) {
    return (
        <div className={`tw-fixed tw-w-screen tw-h-screen tw-bg-black tw-bg-opacity-75 ${props.show ? 'tw-grid' : 'tw-hidden' } tw-place-items-center tw-overflow-y-auto`}>
            <PerfectScrollbar className="tw-w-screen tw-h-screen tw-grid tw-place-items-center tw-p-4">
                <div className="tw-max-w-lg tw-w-full tw-bg-white tw-rounded-2xl tw-p-6 tw-flex tw-flex-col">

                    {/* for close button */}
                    <div className="tw-w-full tw-flex tw-justify-end">
                        <i className="bi bi-x-lg tw-text-xl" onClick={props.handleClose} />
                    </div>
                    <img className="" src={props.url} alt="Bukti pembayaran"  />
                </div>
            </PerfectScrollbar>
        </div>
    )
}
