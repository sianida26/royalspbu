import Tank from './Tank'
import Penerimaan from './Penerimaan'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    id: number,
    tank: Tank,
    initialStock: number,
    penerimaan: Penerimaan | null,
    theoriticalStock: number,
    actualStock: number,
    reporter: string,
}

export default class PersediaanReport extends Model{

    properties: Properties = {
        id: -1,
        tank: new Tank(),
        initialStock: 0,
        penerimaan: null,
        theoriticalStock: 0,
        actualStock: 0,
        reporter: '',
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

    get id(){
        return this.properties.id
    }

    get tank(){
        return this.properties.tank
    }

    get reporter(){
        return this.properties.reporter
    }

    get product(){
        return this.properties.tank.product.name
    }

    get initialStock(){
        return this.properties.initialStock
    }

    get penerimaan(){
        return this.properties.penerimaan
    }

    get tankName():string{
        return this.properties.tank.name
    }

    get theoriticalStock(){
        return this.properties.theoriticalStock
    }

    get actualStock(){
        return this.properties.actualStock
    }

    set tankName(name: string){
        this.properties.tank.set({name})
    }
}