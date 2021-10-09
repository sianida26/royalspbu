import Model, {ModelProps} from './Model'

interface RoleProperties extends ModelProps{
    id: number,
    name: string,
}

export default class Role extends Model {
    
    properties: RoleProperties = {
        id: -1,
        name: '',
    }

    constructor(props?: Partial<RoleProperties>){
        super()
        if (props === undefined) return;

        this.properties = {
            ...this.properties,
            ...props,
        }

        this._isDefined = true
    }
}