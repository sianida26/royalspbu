import React from 'react'
import { useHistory } from 'react-router-dom'

import {useAuth} from '../../providers/AuthProvider'
import axios from '../../utils/oooperator'
import DB from '../../utils/DB'

export default function Logout() {

    const history = useHistory()
    const db = new DB()
    const {auth, setAuthState} = useAuth()

    React.useEffect(() => {
        axios({method: 'get', url: '/logout'})

        let authObject = {
            name: '',
            role: undefined,
            username: '',
            token: '',
        }

        setAuthState(authObject)
        db.auth.put({key: 'auth_token', value: authObject.token})
        db.auth.put({key: 'name', value: authObject.name})
        db.auth.put({key: 'username', value: authObject.username})
        db.auth.put({key: 'role', value: authObject.role})
        history.replace('/')
    })

    return (
        <div>
            
        </div>
    )
}
