import Tank from './Tank'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    tank: Tank,
    volume: number,
}

export default class Penerimaan extends Model{

    properties: Properties = {
        tank: new Tank(),
        volume: 0,
    }

    constructor(props?: Partial<Properties>){
        super()
        if (props === undefined) return
        this.properties = {
            ...this.properties,
            ...props,
        }
        this._isDefined = true
    }

    get tankName(){
        return this.properties.tank.name
    }

    get volume(){
        return this.properties.volume
    }

    set tankName(name: string){
        this.properties.tank.set({name})
    }
}