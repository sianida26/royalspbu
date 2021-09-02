import React from 'react'

import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useSnackbar } from 'notistack'
import DatePicker from 'react-datepicker'

import { 
    IconButton 
} from '@material-ui/core'

import  {
    Today as TodayIcon,
} from '@material-ui/icons'

import { useAuth } from '../../../providers/AuthProvider'

interface Presence {
    id: number,
    name: string,
    status: boolean,
    time?: string|null,
}

export default function PresenceListTab() {

    const { axios } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    const [isLoading, setLoading] = React.useState(true)
    const [presences, setPresences] = React.useState<Presence[]>([])
    const [selectedDate, setSelectedDate] = React.useState(new Date())

    React.useEffect(() => {
        requestPresenceList()
    }, [selectedDate])

    const DatePickerInput = (
        props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 
        ref: React.Ref<HTMLButtonElement>
    ) => {
        return (
            <span 
                className="tw-flex tw-items-center"
                onClick={props.onClick}
                ref={ref}
            >
                <span>{format(selectedDate, 'EEEE, dd LLLL yyyy', {locale: localeId})}</span>
                <IconButton color="primary">
                    <TodayIcon />
                </IconButton>
            </span>
        )
    }

    const requestPresenceList = () => {
        setLoading(true)
        axios({
            data: {
                date: format(selectedDate, 'dd-MM-yyyy')
            },
            method: 'post', 
            url: '/admin/presence/list',
        })
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
        <div className="tw-w-full tw-px-4">
            {/* calendar */}
            <div className="tw-w-full tw-flex tw-justify-end tw-items-center tw-mt-4">
                <DatePicker 
                    selected={selectedDate}
                    onChange={(d) => {
                        if (!(d instanceof Date)) return
                        setSelectedDate(d)
                    }}
                    customInput={React.createElement(React.forwardRef(DatePickerInput))}
                    maxDate={new Date()}
                />
            </div>
            
            {/* data table */}
            <table className="tw-w-full">
                <thead className="tw-text-left">
                    <tr className="tw-bg-gray-300">
                        <th className="tw-text-center tw-py-1 tw-px-1">#</th>
                        <th className="tw-py-1">Nama</th>
                        <th className="tw-py-1">Kehadiran</th>
                    </tr>
                </thead>
                <tbody className="tw-text-left">
                    {
                        isLoading ? (
                            <tr className="tw-border-b tw-border-gray-800">
                                <td colSpan={3} className="tw-text-center tw-py-1">Loading...</td>
                            </tr>
                        ) : presences.length <= 0 ? (
                            <tr className="tw-border-b tw-border-gray-800">
                                <td colSpan={3} className="tw-text-center tw-py-1">Tidak ada data</td>
                            </tr>
                        ) : presences.map((user,i) => (
                            <tr key={user.id} className="tw-border-b tw-border-gray-800">
                                <td className="tw-text-center tw-py-1">{i+1}</td>
                                <td className="tw-py-1">{user.name}</td>
                                <td className="tw-py-1">
                                    <span className="tw-flex tw-gap-2 tw-items-center">
                                        <span className={`tw-w-3 tw-h-3 tw-rounded-full ${user.status ? 'tw-bg-green-500' : 'tw-bg-red-500'}`} />
                                        <span>{user.status ? 'Hadir' : 'Tidak hadir'}</span>
                                        {
                                            user.status && <span className="tw-text-gray-500 tw-text-sm">({user.time && format(new Date(user.time), 'HH:mm:ss')})</span>
                                        }
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
