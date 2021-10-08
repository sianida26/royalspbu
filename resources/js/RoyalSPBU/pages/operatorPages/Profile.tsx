import React from 'react'
import { useHistory } from 'react-router'

import { useAuth } from '../../providers/AuthProvider'
import ModalChangePassword from '../../components/modals/ModalChangePassword'

export default function Profile() {

    const history = useHistory()
    
    const {auth} = useAuth()

    const [showModal, setShowModal] = React.useState(false)

    const handleClickChangePassword = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-screen tw-bg-gray-50">

            {/* topbar */}
            <div className="tw-flex tw-items-center tw-w-full tw-h-14 tw-bg-primary-700 tw-px-5 tw-py-4 tw-justify-between">
                <i 
                    className="bi bi-house-fill tw-text-white tw-text-2xl" 
                    onClick={() => history.goBack()}
                />
                <span className="tw-text-white tw-font-smeibold tw-text-3xl tw-text-center tw-justify-center">Profil</span>
                <i />
            </div>

            {/* nama */}
            <div className="tw-grid tw-grid-cols-5 tw-gap-4 tw-mt-10 tw-w-full tw-px-5 tw-items-center tw-justify-center">
                <div className="tw-col-span-2 tw-font-semibold tw-text-xl">Nama</div>
                <div className="tw-col-span-2 tw-font-semibold tw-text-xl tw-text-gray-700 tw-border-b tw-border-gray-500">{auth.name}</div>
                <div className="tw-col-span-2 tw-font-semibold tw-text-xl">Username</div>
                <div className="tw-col-span-2 tw-font-semibold tw-text-xl tw-text-gray-700 tw-border-b tw-border-gray-500">{auth.username}</div>
            </div>

            {/* button */}
            <div className="tw-grid tw-grid-row-2 tw-gap-10 tw-mt-24 tw-items-center tw-justify-center">
                <button 
                    onClick={handleClickChangePassword}
                    className="tw-font-semibold tw-text-2xl tw-text-center tw-text-white tw-py-2 tw-px-8 tw-bg-green-500 tw-rounded-3xl focus:tw-outline-none tw-box"
                >
                    Ganti Password
                </button>
                <button 
                    onClick={() => history.replace('/logout')}
                    className="tw-font-semibold tw-text-2xl tw-text-center tw-text-white tw-py-2 tw-px-8 tw-bg-primary-500 tw-rounded-3xl focus:tw-outline-none tw-box"
                >
                    Logout
                </button>
            </div>

            <ModalChangePassword show={showModal} onClose={handleCloseModal} onFinished={handleCloseModal} />
        </div>
    )
}
