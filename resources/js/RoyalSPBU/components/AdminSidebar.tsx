import React from 'react'
import { useHistory } from 'react-router'

import zIndexes from '../constants/zIndexes'
import sidebarItems from '../constants/adminSidebarItems'

interface Props{
    open: boolean,
    onClose: () => void,
}

export default function AdminSidebar(props: Props) {

    const history = useHistory()

    const [backdropShow, setBackdropShow] = React.useState(false)

    React.useEffect(() => {
        if (props.open) setBackdropShow(true)
        setTimeout(() => {
            if (!props.open) setBackdropShow(false)
        },500)
    }, [props.open])

    const handleClickNavItem = (link: string) => {
        history.push(link)
        props.onClose()
    }

    return (
        <div className="tw-relative">
            <div className={`tw-fixed tw-w-72 tw--left-72 tw-transform ${props.open ? 'tw-translate-x-72' : ''} tw-h-screen tw-bg-sky-700 tw-flex tw-flex-col tw-text-white tw-px-3 tw-py-4 tw-transition-transform tw-ease-in-out tw-duration-500`} style={{zIndex: zIndexes.sideBar}}>
                {/* user name and logout button */}
                <div className="tw-flex tw-px-1 tw-items-center">
                    <div className="tw-flex-grow" onClick={() => history.push('/profil')}>
                        <h2 className="tw-font-semibold tw-text-xl">Fulan bin Fulan</h2>
                        <p>Admin</p>
                    </div>

                    {/* close button */}
                    <i className="bi bi-arrow-bar-left tw-text-2xl" onClick={props.onClose} />
                </div>

                {/* items */}
                {/* //todo lanjutkan buat item sidebar */}
                <div className="tw-flex tw-flex-col tw-mt-3 tw-px-2">
                    {sidebarItems.map((item, i) => (<div key={i} onClick={() => handleClickNavItem(item.link)} className="tw-py-4 tw-text-md tw-flex tw-gap-3 tw-border-b tw-border-white">
                        <i className={`bi bi-${item.icon}`} />
                        <span>{item.text}</span>
                    </div>))}
                </div>

            </div>

            {/* backdrop */}
            <div className={`tw-backdrop-filter tw-transition tw-duration-500 tw-ease-in-out ${props.open ? 'tw-fixed tw-backdrop-brightness-50' : 'tw-hidden tw-backdrop-brightness-100'} tw-w-screen tw-h-screen`} style={{zIndex: zIndexes.sideBarBackdrop}} />
            
        </div>
    )
}
