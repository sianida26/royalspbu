import React from 'react'

import zIndexes from '../constants/zIndexes'

interface Props {
    children?: React.ReactNode,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    show: boolean,
}

export default function Backdrop(props: Props) {
    return (
        <div
            className={`tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-h-screen tw-p-4 ${props.show ? 'tw-grid' : 'tw-hidden'} tw-place-items-center tw-bg-black tw-bg-opacity-75`}
            onClick={props.onClick}
            style={{zIndex: zIndexes.modalBackdrop}}
        >
            <div onClick={(e) => e.stopPropagation()} className="tw-w-full">
                {props.children}
            </div>
        </div>
    )
}