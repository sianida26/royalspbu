
interface ConstructorProps {
    id?: number,
    name?: string,
}

interface RoleProperties{
    id: number,
    name: string,
}

export default class Role {
    
    private properties: RoleProperties = {
        id: -1,
        name: '',
    }

    private _isDefined = false

    constructor(props?: ConstructorProps){
        if (props === undefined) return;

        this.properties = {
            ...this.properties,
            ...props,
        }

        this._isDefined = true
    }


    isDefined(){
        return this._isDefined
    }

    isNotDefined(){
        return !this._isDefined
    }
}