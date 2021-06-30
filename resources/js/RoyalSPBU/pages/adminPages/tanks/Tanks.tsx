import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router'
import { useSnackbar } from 'notistack'
import { useAdminConfig } from '../../../providers/AdminConfigProvider'


import axios from  '../../../utils/AdminAxios'
import {TankObject} from '../../../types'


interface ServerResponse {
    id: number,
    name: string,
    productId: number,
    product: string,
    stock: number,
}

export default function Tanks() {

    const history = useHistory()
    const {enqueueSnackbar} = useSnackbar()

    const {configs, setConfig} = useAdminConfig()

    const [tanks, setTanks] = useState<ServerResponse[]>([])
    const [isLoading, setLoading] = useState(true)

    const requestAllTanks = () => {
        setLoading(true)
        axios({method:'get', url: '/tank/getAll'})
        .then(result => { //handle success response
            let data : ServerResponse[] = result.data;
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

    useEffect(() => {
        requestAllTanks()
    },[])

    const handleEditTank = (x: TankObject) => {
        setConfig({editTankObject: x})
        history.push('/tanks/edit');
    }

    const handleDeleteTank = (x: TankObject) => {
        //TODO: Tambah konfirmasi dengan password
        setLoading(true)
        axios({method:'post', url: '/tank/delete', data: {id: x.id, /*password: */}})
        .then(result => { //handle success response
            let data = result.data;
            console.log(data);
            enqueueSnackbar(`Tangki ${x.name} berhasil dihapus`,{variant: 'warning'})
            requestAllTanks()
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
                    case 403: {
                        errorMessage = error.response.data.message
                    } break;
                }
            }
            //you can show error notification here
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => setLoading(false))
    }

    return (
        <div className="tw-flex tw-flex-col">
            <button className="tw-border tw-border-black tw-py-2" onClick={() => history.push('/tanks/tambah')}>Tambah Tangki</button>
            {
                isLoading ? <span>Loading...</span>
                : tanks.length > 0 ? tanks.map((x,i) => (
                    <div key={x.id} className="tw-w-full tw-border tw-border-black tw-rounded-lg tw-p-4 tw-flex tw-flex-col">
                        <p>Nomor Tangki : {i+1}</p>
                        <p>Nama Tangki: {x.name}</p>
                        <p>Produk: {x.product}</p>
                        <p>Stok: {x.stock}</p>
                        <div className="tw-flex tw-justify-around">
                            <span onClick={() => handleEditTank(x)}>Edit</span>
                            <span onClick={() => handleDeleteTank(x)}>Delete</span>
                        </div>
                    </div>
                ))
                : <span>Belum ada tangki</span>
            }
        </div>
    )
}
