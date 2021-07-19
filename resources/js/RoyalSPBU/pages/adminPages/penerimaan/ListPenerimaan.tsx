import React from 'react'

import { useAdminConfig } from '../../../providers/AdminConfigProvider'
import { useHistory } from 'react-router'
import { useAuth } from '../../../providers/AuthProvider'

interface Penerimaan{
    actualVolume? : number,
    id: number,
    initialVolume? : number,
    issueTimestamp: string,
    issuer: string,
    pnbp?: string,
    pnbpVolume: number,
    receiveTimestamp?: string,
    receiver?: string,
    tankId: number,
    tankName: string,
    truckId?: string
}

export default function ListPenerimaan() {

    // todo: buat handle untuk edit konfirmasi penerimaan

    const history = useHistory()
    const {axios} = useAuth()
    const {configs, setConfig} = useAdminConfig()

    const [ongoings, setOngoings] = React.useState<Penerimaan[]>([])
    const [finishedPenerimaans, setFinishedPenerimaan] = React.useState<Penerimaan[]>([])
    const [isLoading, setLoading] = React.useState(true)

    React.useEffect(() => {
        getAllPenerimaan()
    },[])

    const getAllPenerimaan = () => {
        setLoading(true)
        axios({url: '/admin/penerimaan/all'})
        .then(response => {
            console.log(response.data)
            let data: Penerimaan[] = response.data
            setOngoings(data.filter(penerimaan => {
                return penerimaan.receiveTimestamp === null
            }))
            setFinishedPenerimaan(data.filter(penerimaan => {
                return penerimaan.receiveTimestamp !== null
            }))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleEditOngoing = (penerimaan: Penerimaan) => {
        setConfig({
            editRequestPenerimaanObject: {
                id: penerimaan.id,
                tankId: penerimaan.tankId,
                volume: penerimaan.pnbpVolume,
            }
        })
        history.push('/penerimaan/minta/edit')
    }

    const handleKonfirmasi = (penerimaan: Penerimaan) => {
        setConfig({
            konfirmasiPenerimaanObject: {
                id: penerimaan.id,
                tankId: penerimaan.tankId,
                issueTimestamp: penerimaan.issueTimestamp,
                issuer: penerimaan.issuer,
                pnbpVolume: penerimaan.pnbpVolume,
                tankName: penerimaan.tankName,
            }
        })
        history.push('/penerimaan/konfirmasi')
    }

    const handleDetail = (penerimaan: Penerimaan) => {
        setConfig({
            detailPenerimaanObject: {
                actualVolume: penerimaan.actualVolume!,
                id: penerimaan.id,
                initialVolume: penerimaan.initialVolume!,
                issueTimestamp: penerimaan.issueTimestamp,
                issuer: penerimaan.issuer,
                pnbp: penerimaan.pnbp!,
                pnbpVolume: penerimaan.pnbpVolume,
                receiveTimestamp: penerimaan.receiveTimestamp!,
                receiver: penerimaan.receiver!,
                tankId: penerimaan.tankId,
                tankName: penerimaan.tankName,
                truckId: penerimaan.truckId!,
            }
        })
        history.push('/penerimaan/detail')
    }

    const handleDelete = (id: number) => {
        setLoading(true)
        axios({
            url: '/admin/penerimaan/delete',
            data: {id},
            method: 'post',
        })
        //todo buat aksi snackbar
        .then((response) => {
            getAllPenerimaan()
        })
        .catch(err => {
            console.log(err.response)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="tw-flex tw-flex-col tw-w-full tw-p-2 tw-gap-2">
            
            <button className="tw-w-full tw-border tw-border-black tw-py-2" onClick={() => {history.push('/penerimaan/minta')}}>Buat Permintaan</button>
            <span>Ongoing</span>
            {
                isLoading ? <span>Loading...</span>
                : ongoings.length < 1 ? <span>Tidak ada data</span>
                : ongoings.map(penerimaan => <div key={penerimaan.id} className="tw-w-full tw-border tw-border-black tw-flex tw-flex-col">
                    <p>Hari, tanggal penerimaan: {penerimaan.issueTimestamp}</p>
                    <p>Pemohon: {penerimaan.issuer}</p>
                    <p>Nama Tangki: {penerimaan.tankName}</p>
                    <p>Volume PNBP: {penerimaan.pnbpVolume}</p>
                    <button onClick={() => handleEditOngoing(penerimaan)}>Edit</button>
                    <button onClick={() => handleKonfirmasi(penerimaan)}>Sudah diterima</button>
                    <button onClick={() => handleDelete(penerimaan.id)}>Hapus</button>
                </div>)
            }
            <span>History</span>
            {
                isLoading ? <span>Loading...</span>
                : finishedPenerimaans.length < 1 ? <span>Tidak ada data</span>
                : finishedPenerimaans.map(penerimaan => <div key={penerimaan.id} className="tw-w-full tw-border tw-border-black tw-flex tw-flex-col">
                    <p>Hari, tanggal permintaan: {penerimaan.receiveTimestamp}</p>
                    <p>Nama Tangki: {penerimaan.tankName}</p>
                    {/* <button onClick={() => handleEditOngoing(penerimaan)}>Edit</button> */}
                    <button onClick={() => handleDetail(penerimaan)}>Lihat</button>
                </div>)
            }
        </div>
    )
}
