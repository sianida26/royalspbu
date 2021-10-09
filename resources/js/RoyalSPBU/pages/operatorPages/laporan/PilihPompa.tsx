import React from 'react'

import Pump from '../../../models/Pump'


interface Props {
    pumps: Pump[]
    handlePilihPompa: (pump: Pump) => void
}

export default function PilihPompa({pumps, handlePilihPompa}: Props) {
    return pumps.length > 0 ? (
        <div className="tw-grid tw-px-4 tw-pt-8 tw-grid-cols-2 tw-place-items-center tw-gap-4">
            {
                pumps.map(pump => <div 
                    key={pump.id} 
                    onClick={() => {pump.available ? handlePilihPompa(pump) : null}}
                    className={`tw-w-32 tw-h-32 tw-rounded-lg tw-flex tw-flex-col tw-border-2 tw-border-orange-600 ${!pump.available && 'tw-opacity-50 tw-bg-gray-500'}`}
                    style={{boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)'}}
                >
                    <div className="tw-rounded-t-lg tw-py-1 tw-bg-orange-600 tw-flex tw-justify-center tw-font-medium tw-text-white">
                        Pulau Pompa
                    </div>
                    <div className="tw-w-full tw-h-full tw-grid tw-place-items-center">
                        <span className="tw-text-5xl tw-font-medium">{pump.pumpNumber}</span>
                    </div>
                </div>)
            }
        </div>
    ) : <div>Tidak ada pompa</div>
}
