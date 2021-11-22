import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'


import AdminHeaderSidebar from '../../../components/AdminHeaderSidebar'
import Pump from '../../../models/Pump'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useAuth } from '../../../providers/AuthProvider'


interface ServerResponse {
    id: number,
    nozzles: {
        id: number,
        tankId: number,
        totalizator: number,
    }[],
}

export default function Pumps() {

    const history = useHistory()
    
    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()
    const { setConfig } = useAdminConfig()

    const [isLoading, setLoading] = useState(true)
    const [pumps, setPumps] = useState<Pump[]>([])

    const requestAllPumps = () => {
        setLoading(true)
        axios({method:'get', url: '/admin/pump/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
            setPumps(data.map((pump,i) => {
                let model = new Pump({id: pump.id, pumpNumber: i+1})
                model.inputNozzles(pump.nozzles)
                return model
            }))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    useEffect(() => {
        requestAllPumps()
    },[])

    const handleEditPump = (pump: Pump) => {
        setConfig({editPumpObject: pump})
        history.push('/pompa/edit')
    }

    const renderSkeleton = () => {
        return [1,2,3,4].map(x => <div 
            key={x}
            className="tw-w-32 tw-h-32 tw-rounded-lg tw-animate-pulse tw-bg-gray-400"
            style={{boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)'}}
        />)
    }

    return (
        <div className="tw-flex tw-flex-col">
            <AdminHeaderSidebar title="Pulau Pompa" />
            <div className="tw-grid tw-px-4 tw-pt-8 tw-grid-cols-2 tw-place-items-center tw-gap-4 tw-max-w-screen-sm tw-w-full tw-self-center">
                {
                    isLoading ? renderSkeleton()
                    : <>
                        {pumps.map((pump, i) => <div 
                            className="tw-w-32 tw-h-32 tw-rounded-lg tw-flex tw-flex-col tw-border-2 tw-border-orange-600"
                            key={i}
                            onClick={() => handleEditPump(pump)}
                            style={{boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)'}}
                        >
                            <div className="tw-rounded-t-lg tw-py-1 tw-bg-orange-600 tw-flex tw-justify-center tw-font-medium tw-text-white">
                                Pulau Pompa
                            </div>
                            <div className="tw-w-full tw-h-full tw-grid tw-place-items-center">
                                <span className="tw-text-5xl tw-font-medium">{i+1}</span>
                            </div>
                        </div>)}

                        {/* tambah pompa */}
                        <div 
                            className="tw-w-32 tw-h-32 tw-rounded-lg tw-flex tw-flex-col tw-border-2 tw-border-gray-600 tw-border-dashed"
                            style={{boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)'}}
                            onClick={() => history.push('/pompa/tambah')}
                        >
                            <div className="tw-rounded-t-lg tw-py-1 tw-bg-gray-600 tw-flex tw-justify-center tw-font-medium tw-text-white">
                                Pulau Pompa
                            </div>
                            <div className="tw-w-full tw-h-full tw-grid tw-place-items-center">
                                <span className="tw-text-5xl tw-font-medium">+</span>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
