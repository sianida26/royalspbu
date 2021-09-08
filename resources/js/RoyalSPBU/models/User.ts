interface ConstructorProps{
    id?: number
    name?: string
    username?: string
    roleId?: number
    roleName?: string
    isActive?: boolean
}

export default class User{

    private _isDefined = false

    id = -1
    name = ''
    username = ''
    roleId = -1
    roleName = ''
    isActive = false

    constructor(props?: ConstructorProps){
        if (props === undefined) return
        this.id = props.id || -1
        this.name = props.name || ''
        this.username = props.username || ''
        this.roleId = props.roleId || -1
        this.roleName = props.roleName || ''
        this.isActive = props.isActive || false
        this._isDefined = true
    }

    isDefined(): boolean {
        return this._isDefined
    }

    isNotDefined(): boolean{
        return !this._isDefined
    }
}