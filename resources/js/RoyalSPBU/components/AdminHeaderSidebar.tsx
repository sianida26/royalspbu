import React from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

interface Props{
    title: string
}

export default function AdminHeaderSidebar(props: Props) {

    const [sidebarOpen, setSidebarOpen] = React.useState(false)

    const handleCloseSidebar = () => {
        setSidebarOpen(false)
    }

    const handleOpenSidebar = () => {
        setSidebarOpen(true)
    }

    return (
        <div className="tw-relative tw-h-12">
            <AdminHeader 
                onOpenSidebar={handleOpenSidebar}
                title={props.title} />
            <AdminSidebar 
                open={sidebarOpen}
                onClose={handleCloseSidebar} />
        </div>
    )
}