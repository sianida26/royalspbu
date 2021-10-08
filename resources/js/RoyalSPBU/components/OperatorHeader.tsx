import React from 'react'

import { useHistory } from 'react-router'

interface Props {
    title: string,
}

export default function OperatorHeader(props: Props) {

    const history = useHistory()

    return (
        <div className="tw-flex tw-items-center tw-w-full tw-h-14 tw-bg-primary-700 tw-px-5 tw-py-4 tw-justify-between">
            <i 
                className="bi bi-house-fill tw-text-white tw-text-2xl" 
                onClick={() => history.goBack()}
            />
            <span className="tw-text-white tw-font-smeibold tw-text-3xl tw-text-center tw-justify-center">{props.title}</span>
            <i />
        </div>
    )
}
