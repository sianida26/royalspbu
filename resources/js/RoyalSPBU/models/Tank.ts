import Product from './Product'

interface Properties {
    id: number,
    name: string,
    product: Product|null,
    stock: number,
    tankNumber: number,
}

export default class Tank{

    private _isDefined = false

    private properties: Properties = {
        id: -1,
        name: '',
        product: null,
        stock: 0,
        tankNumber: 0,
    }

    constructor(props?: Partial<Properties>){
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
}