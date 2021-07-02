import Dexie from "dexie"

export default class DB extends Dexie{

    public auth: Dexie.Table<IAuthTable, string>

    constructor(){
        super("AppDB")

        this.version(1).stores({
            auth: 'key, value'
        })

        this.auth = this.table('auth')
    }
}

export interface IAuthTable{
    key: string,
    value: any,
}