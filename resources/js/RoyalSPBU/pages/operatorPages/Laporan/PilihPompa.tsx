import React from 'react'

import {Pump} from './index'


interface Props {
    pumps: Pump[]
    handlePilihPompa: (pump: Pump, n: number) => void
}

export default function PilihPompa({pumps, handlePilihPompa}: Props) {
    return pumps.length > 0 ? (
        <div className="tw-grid tw-grid-cols-2 tw-w-full tw-gap-8">
            {pumps.map((pump,i) => <div 
                key={pump.id} 
                onClick={() => {pump.available ? handlePilihPompa(pump, i) : null}}
                className={`tw-w-24 tw-h-24 tw-border tw-border-black ${!pump.available && 'tw-bg-gray-400'}`}>{`pulau pompa ${i+1}`}</div>)}
        </div>
    ) : <div>Tidak ada pompa</div>
}
