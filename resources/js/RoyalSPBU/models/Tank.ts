import Product from './Product'
import Model, {ModelProps} from './Model'

interface Properties extends ModelProps {
    id: number,
    name: string,
    product: Product,
    stock: number,
    tankNumber: number,
    volumeOut: number,
}

export default class Tank extends Model{

    properties: Properties = {
        id: -1,
        name: '',
        product: new Product(),
        stock: 0,
        tankNumber: 0,
        volumeOut: 0,
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

    get name(){
        return this.properties.name
    }

    get product(){
        return this.properties.product
    }

    get stock(){
        return this.properties.stock
    }

    get tankNumber(){
        return this.properties.tankNumber
    }

    get volumeOut(){
        return this.properties.volumeOut
    }
}