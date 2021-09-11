import Dexie from "dexie"

export interface IAuthTable{
    key: string,
    value: any,
}

export interface IRolesTable{
    id: number,
    name: string,   
}

export default class DB extends Dexie{

    auth: Dexie.Table<IAuthTable, string>
    roles: Dexie.Table<IRolesTable, string>

    constructor(){
        super("RoyalSPBU")

        this.version(2).stores({
            auth: 'key, value',
            roles: 'id, name',
        })

        this.auth = this.table('auth')
        this.roles = this.table('roles')
    }

    getAuthToken = () => {
        return this.auth.get('auth_token')
    }
}