import React from 'react'

import zIndexes from '../constants/zIndexes'

interface Props {
    title: string,
    onOpenSidebar: () => void,
}

export default function AdminHeader(props: Props) {
    return (
        <div className="tw-w-screen tw-bg-sky-700 tw-text-white tw-flex tw-justify-between tw-items-center tw-px-4 tw-h-12 tw-shadow-lg tw-fixed tw-top-0" style={{zIndex: zIndexes.header}}>
            <i className="bi bi-list tw-text-2xl" onClick={props.onOpenSidebar} />
            <h1 className="tw-font-semibold tw-text-lg">{props.title}</h1>
            <i />
        </div>
    )
}
