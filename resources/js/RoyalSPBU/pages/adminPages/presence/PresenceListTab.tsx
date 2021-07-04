import React from 'react'
import { useAuth } from '../../../providers/AuthProvider'
import { useSnackbar } from 'notistack'

interface Presence {
    id: number,
    name: string,
    status: boolean,
}

export default function PresenceListTab() {

    const {axios} = useAuth()
    const {enqueueSnackbar} = useSnackbar()
    const [isShowingDetail, setShowingDetail] = React.useState(false)

    const [presences, setPresences] = React.useState<Presence[]>([])
    const [isLoading, setLoading] = React.useState(true)

    React.useEffect(() => {
        requestPresenceList()
    }, [])

    const requestPresenceList = () => {
        setLoading(true)
        axios({method: 'get', url: '/admin/presence/list'})
        .then((result) => {
            let data: Presence[] = result.data
            setPresences(data)
        })
        .catch(error =>{ //handle error response
            let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
            enqueueSnackbar(errorMessage,{variant:"error"});
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="tw-w-full">
            <table className="tw-w-full">
                <thead className="tw-text-left">
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Kehadiran</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isLoading ? (
                            <tr>
                                <td colSpan={3} className="tw-text-center">Loading...</td>
                            </tr>
                        ) : presences.length <= 0 ? (
                            <tr>
                                <td colSpan={3} className="tw-text-center">Tidak ada data</td>
                            </tr>
                        ) : presences.map((user,i) => (
                            <tr key={user.id}>
                                <td>{i+1}</td>
                                <td>{user.name}</td>
                                <td>{user.status ? 'Hadir' : 'Tidak hadir'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
