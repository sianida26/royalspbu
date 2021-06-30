import React, {useState, useEffect} from 'react'
import {useSnackbar} from 'notistack'
import {useHistory} from 'react-router-dom'
import { useAdminConfig, editTankDefaultObject, editPumpDefaultObject } from '../../../providers/AdminConfigProvider'

import axios from '../../../utils/AdminAxios'
import { NozzleObject, PumpObject, TankObject } from '../../../types'

interface TankServerResponse {
    id: number,
    name: string,
    productId: number,
    product: string,
    stock: number,
}

export default function FormPump() {

    let isEdit = location.pathname.split('/').pop()?.toLowerCase() === "edit"
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    const {configs, setConfig} = useAdminConfig()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<PumpObject>(editPumpDefaultObject)
    const [tanks, setTanks] = useState<TankObject[]>([])

    useEffect(() => {
        requestAllTanks()
        //validating data if in edit mode
        if (isEdit){
            //redirect to home if no data provided in context API
            if (configs.editPumpObject!.id < 0){
                history.replace('/');
                return
            }

            setFormData(configs.editPumpObject!)

            setConfig({editPumpObject: editPumpDefaultObject}) //hapus objek edit
        }
    }, [])

    const handleAddNozzle = () => {
        setFormData(prev => ({
            ...prev,
            nozzles: [
                ...prev.nozzles,
                {
                    id: -1,
                    tankId: tanks[0].id,
                    totalizator: 0,
                }
            ]
        }))
    }

    const handleFormChange = (n: number, name: string, value: string|number) => {
        setFormData(prev => ({
            ...prev,
            nozzles: prev.nozzles.map((nozzle, i) => {
                if (i !== n) return nozzle
                return {
                    ...nozzle,
                    [name]: value,
                }
            })
        }))
    }

    const handleDeleteNozzle = (n: number) => {
        setFormData(prev => ({
            ...prev,
            nozzles : prev.nozzles.filter((nozzle,i) => i !== n)
        }))
    }

    const handleDeletePump = () => {
        //TODO: Tambah konfirmasi dengan password
        setLoading(true)
        axios({method:'post', url: '/pump/delete', data: {id: formData.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`Pompa berhasil dihapus`,{variant: 'warning'})
            history.replace('/pompa')
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 401: {
                        errorMessage = "Password Salah"
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        });
    }

    const handleSave = () => {
        setLoading(true)
        axios({method:'post', url: isEdit?  '/pump/edit' :'/pump/add', data: formData})
        .then(result => { //handle success response
            // setFormErrors({}) todo: set form errors
            let data = result.data;
            enqueueSnackbar(`Pompa berhasil di${isEdit? 'edit' : 'tambahkan'}`,{variant: 'success'})
            history.push('/pompa');
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi admin.";
            if (error.response){
                //Error caused from the server
                console.log(error.response);
                let errorCode = error.response.status
                switch(errorCode){
                    case 422: {
                        //todo: add form errors
                        // setFormErrors(error.response.data.errors)
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    const requestAllTanks = () => {
        setLoading(true)
        axios({method:'get', url: '/tank/getAll'})
        .then(result => { //handle success response
            let data : TankServerResponse[] = result.data;
            setTanks(data.map(tank => ({
                id: tank.id,
                name: tank.name,
                product: tank.product,
                productId: tank.productId,
                stock: tank.stock,
            })))
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className="tw-w-full tw-flex tw-flex-col tw-gap-2">
            {
                formData.nozzles.map((nozzle,i) => {

                    return (<div className="tw-border tw-border-black tw-rounded-md tw-flex tw-flex-col tw-gap-1">
                        <p>Nozzle {i+1}</p>
                        <p>Produk</p>
                        <select name="" value={nozzle.tankId} onChange={(e) => handleFormChange(i,"tankId",e.target.value)}>
                            {
                                tanks.map(tank => <option value={tank.id}>{tank.name}</option>)
                            }
                        </select>
                        <p>Totalisator</p>
                        <input className="tw-border tw-border-black tw-p-1" type="number" value={nozzle.totalizator} onChange={(e) => handleFormChange(i,"totalizator",e.target.value)} />
                        <span className="" onClick={() => handleDeleteNozzle(i)}>Hapus</span>
                    </div>)
                })
            }
            <div className="tw-border tw-border-black" onClick={handleAddNozzle}>Tambah Nozzle</div>
            <div className={`tw-border tw-border-black tw-bg-red-300 ${!isEdit && 'tw-hidden'}`} onClick={handleDeletePump}>Hapus Pompa</div>
            <div className="tw-border tw-border-black tw-bg-green-300" onClick={handleSave}>Simpan</div>
        </div>
    )
}
