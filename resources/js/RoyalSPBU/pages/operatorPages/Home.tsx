import React from 'react'
import { useHistory } from 'react-router'

import { useAuth } from '../../providers/AuthProvider'
import { useConfig, ReportStatus } from '../../providers/ConfigProvider'
import { useSnackbar } from 'notistack'

interface ServerResponse {
    presence: boolean,
    report: boolean,
}

const bunderanStyle: React.CSSProperties = {
    backgroundColor: 'rgba(3, 105, 161)',
    height: '150vw',
    width: '150vw',
    borderRadius: '9999px',
    position: 'absolute',
    top: 'calc(200px - 150vw)',
    zIndex: 0,
}

const kotakStyle: React.CSSProperties = {
    border: '1px solid #E4E4E7',
    boxSizing: 'border-box',
    boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '24px',
}

export default function Home() {

    const history = useHistory()
    const { configs, setConfig } = useConfig()
    const { enqueueSnackbar } = useSnackbar()
    const { auth, axios } = useAuth()

    React.useEffect(() => {
        setTimeout(() => requestReportingStatus(), 3000)
        // requestReportingStatus()
    }, [])

    const requestReportingStatus = () => {
        axios({method:'get', url: '/getReportingStatus'})
        .then(result => { //handle success response
            let data: ServerResponse = result.data;
            setConfig({
                laporanStatus: data.report ? ReportStatus.SUDAH_LAPORAN : ReportStatus.BELUM_LAPORAN,
                presenceStatus: data.presence ? ReportStatus.SUDAH_LAPORAN : ReportStatus.BELUM_LAPORAN,
            })
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            if (error.response){
                //Error caused from the server
                let errorCode = error.response.status
                switch(errorCode){
                    case 400: /*bad request*/ break; 
                    case 401: /*Unauthorized*/ break;
                    case 403: /*Forbidden*/ break;
                    case 404: /*not found*/ break; 
                    case 405: /*method not allowed*/ break; 
                    case 408: /*Request timed out*/ break;
                    case 409: /*Conflict*/ break;
                    case 419: /*Page expired, CSRF token missing*/ break;
                    case 422: /*Validation failed*/ break;
                    case 429: /*Too Many Request */ break;
                    case 500: //server error
                        errorMessage=`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                        break; 
                    default: /* Other errors */
                        errorMessage=`Ups. terjadi error (${errorCode})`;
                }
            } else if (error.request){
                //Request was made but no response was received
            } else {
                //Something happened in setting up the request that triggered an Error
            }
            //you can show error notification here
            if (errorMessage) enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => {
            //
        })
    }

    const handleAbsenClick = () => {
        history.push('/absen')
    }

    const handleLaporanClick = () => {
        history.push('/laporan')
    }

    const renderBelumPresensi = () => <div 
        className="tw-flex tw-flex-col tw-gap-2 tw-items-center tw-justify-center tw-mt-10 tw-w-36 tw-h-36 tw-rounded-3xl tw-px-2 tw-py-2 tw-bg-orange-500"
        style={kotakStyle}
        onClick={handleAbsenClick}
    >
        <i className="bi bi-upc-scan tw-justify-center tw-text-white tw-text-6xl" />
        <span className="tw-font-semibold tw-text-3xl tw-text-white tw-text-center">Presensi</span>
    </div>

    const renderSudahPresensi = () => <div 
        className="tw-flex tw-flex-col tw-gap-2 tw-items-center tw-justify-center tw-mt-10 tw-w-36 tw-h-36 tw-rounded-3xl tw-px-2 tw-py-2 tw-bg-green-500"
        style={kotakStyle}
    >
        <i className="bi bi-person-check-fill tw-justify-center tw-text-white tw-text-5xl" />
        <span className="tw-font-semibold tw-text-3xl tw-text-white tw-text-center tw-leading-7">Sudah Presensi</span>
    </div>

    const renderBelumLaporan = () => <div
        className="tw-flex tw-flex-col tw-gap-2 tw-items-center tw-justify-center tw-mt-10 tw-w-36 tw-h-36 tw-rounded-3xl tw-px-2 tw-py-2 tw-bg-red-500"
        style={kotakStyle}
        onClick={handleLaporanClick}
    >
        <i className="bi bi-clipboard-data tw-justify-center tw-text-white tw-text-6xl" />
        <span className="tw-font-semibold tw-text-3xl tw-text-white tw-text-center">Laporan</span>
    </div>

    const renderSudahLaporan = () => <div
        className="tw-flex tw-flex-col tw-gap-2 tw-items-center tw-justify-center tw-mt-10 tw-w-36 tw-h-36 tw-rounded-3xl tw-px-2 tw-py-2 tw-bg-green-500"
        style={kotakStyle}
    >
        <i className="bi bi-clipboard-check tw-justify-center tw-text-white tw-text-5xl" />
        <span className="tw-font-semibold tw-text-3xl tw-text-white tw-text-center tw-leading-7">Sudah Laporan</span>
    </div>

    const renderLoading = () => <div
        className="tw-animate-pulse tw-mt-10 tw-w-36 tw-h-36 tw-rounded-3xl tw-bg-gray-400"
        style={kotakStyle}
    />

    const handleProfileClick = () => {
        history.push('/profil')
    }

    return (
        <div className="tw-w-screen tw-bg-gray-50">
            <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-h-screen tw-relative tw-overflow-x-hidden">
                
                {/* bunderan */}
                <div style={bunderanStyle} />

                {/* profile */}
                <span 
                    onClick={handleProfileClick}
                    style={{zIndex: 2}}
                    className="tw-rounded-full tw-absolute tw-right-3 tw-top-3 tw-bg-primary-700 tw-w-12 tw-h-12 tw-flex tw-items-center tw-justify-center"
                >
                    <i className="bi bi-person-circle tw-text-3-xl tw-text-right tw-text-white" />
                </span>

                <div className="tw-w-full tw-h-full tw-flex tw-flex-col" style={{zIndex: 1}}>
                    <div className="tw-flex tw-flex-col tw-gap-1.5 tw-mt-12 tw-items-center">
                        <span className="tw-font-semibold tw-text-2xl tw-text-white">Hai</span>
                        <span className="tw-font-bold tw-text-3xl tw-text-white">{auth.name}</span>
                    </div>

                    {/* logo */}
                    <div className="tw-flex tw-justify-center">
                        <div className="tw-flex tw-items-center tw-justify-center tw-mt-2 tw-w-32 tw-h-32 tw-rounded-full tw-bg-white tw-border-10 tw-border-gray-400">
                            <img src="/images/logos/logo.svg" alt="Royal SPBU" className="tw-h-12" />
                        </div>
                    </div>
                </div>

                {/* button */}
                <div className="tw-flex tw-justify-around tw-w-screen tw-h-screen">

                    {/* presensi */}
                    {
                        configs.presenceStatus === ReportStatus.NO_DATA ? renderLoading()
                        : configs.presenceStatus === ReportStatus.BELUM_LAPORAN ? renderBelumPresensi()
                        : renderSudahPresensi()
                    }

                    {/* laporan */}
                    {
                        configs.laporanStatus === ReportStatus.NO_DATA ? renderLoading()
                        : configs.laporanStatus === ReportStatus.BELUM_LAPORAN ? renderBelumLaporan()
                        : renderSudahLaporan()
                    }
                </div>

                {/* copyright */}
                <span className="tw-justify-center tw-mb-4">&copy; 2021 Royal SPBU</span>
            </div>
        </div>
    )
}
