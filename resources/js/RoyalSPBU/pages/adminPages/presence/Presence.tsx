import React from 'react'

import Scan from './Scan'
import PresenceList from './PresenceListTab'
import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'

enum Tab{
    SCAN,
    LIST
}

export default function Presence() {

    const [tab, setTab] = React.useState(Tab.SCAN)

    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Presensi" />
            <div className="tw-flex tw-flex-col tw-w-full tw-min-h-full tw-items-center lg:tw-pt-8">
                <div className="lg:tw-border tw-max-w-screen-sm tw-w-full tw-flex tw-flex-col tw-justify-center tw-pb-8 lg:tw-rounded-lg">
                    <div className="tw-w-full tw-flex tw-gap-3 tw-mt-8 tw-px-4 tw-items-center tw-justify-center">
                        <span className={`${tab === Tab.SCAN ? 'tw-border-b-2 tw-border-orange-500 tw-font-medium tw-text-lg tw-transition-all tw-ease-in-out tw-duration-200' : 'tw-border-b-0'}`} onClick={() => setTab(Tab.SCAN)}>Presensi</span>
                        <span className={`${tab !== Tab.SCAN ? 'tw-border-b-2 tw-border-orange-500 tw-font-medium tw-text-lg tw-transition-all tw-ease-in-out tw-duration-200' : 'tw-border-b-0'}`} onClick={() => setTab(Tab.LIST)}>List Presensi</span>
                    </div>
                    <div className="tw-w-full tw-flex tw-items-center tw-justify-center">
                        {
                            tab === Tab.SCAN ? <Scan /> : <PresenceList />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
