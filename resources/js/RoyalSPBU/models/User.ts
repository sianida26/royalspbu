interface UserProps {
    id: number,
    name: string,
    username: string,
    roleId: number,
    password: string,
    roleName: string,
    isActive: boolean,
}

export default class User{

    private _isDefined = false

    private properties: UserProps = {
        id: -1,
        name: '',
        username: '',
        password: '',
        roleId: -1,
        roleName: '',
        isActive: false,
    }

    constructor(props?: Partial<UserProps>){
        if (props === undefined) return
        this.properties = {
            ...this.properties,
            ...props,
        }
        this._isDefined = true
    }

    isDefined(): boolean {
        return this._isDefined
    }

    isNotDefined(): boolean{
        return !this._isDefined
    }

    toObject(): UserProps {
        return this.properties
    }

    set(props: Partial<UserProps>): this{
        this.properties = {
            ...this.properties,
            ...props,
        }
        return this
    }

    get id(){
        return this.properties.id
    }

    get name(){
        return this.properties.name
    }

    get username(){
        return this.properties.username
    }

    get roleId(){
        return this.properties.roleId
    }

    get roleName(){
        return this.properties.roleName
    }

    get isActive(){
        return this.properties.isActive
    }

    get password(){
        return this.properties.password
    }
}