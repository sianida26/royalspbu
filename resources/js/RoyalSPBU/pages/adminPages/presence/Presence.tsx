import React from 'react'

import Scan from './Scan'
import PresenceList from './PresenceListTab'

enum Tab{
    SCAN,
    LIST
}

export default function Presence() {

    const [tab, setTab] = React.useState(Tab.SCAN)

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <div className="tw-w-full tw-flex tw-gap-3">
                <span className={`${tab === Tab.SCAN && 'tw-border tw-border-black'}`} onClick={() => setTab(Tab.SCAN)}>Presensi</span>
                <span className={`${tab !== Tab.SCAN && 'tw-border tw-border-black'}`} onClick={() => setTab(Tab.LIST)}>List Presensi</span>
            </div>
            {
                tab === Tab.SCAN ? <Scan /> : <PresenceList />
            }
        </div>
    )
}
