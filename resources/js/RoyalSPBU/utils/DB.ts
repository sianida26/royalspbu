import Dexie from "dexie"

export default class DB extends Dexie{

    auth: Dexie.Table<IAuthTable, string>

    constructor(){
        super("RoyalSPBU")

        this.version(1).stores({
            auth: 'key, value'
        })

        this.auth = this.table('auth')
    }

    getAuthToken = () => {
        return this.auth.get('auth_token')
    }
}

export interface IAuthTable{
    key: string,
    value: any,
}