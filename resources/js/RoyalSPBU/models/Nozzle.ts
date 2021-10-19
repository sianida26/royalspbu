import Tank from './Tank'
import Model, {ModelProps} from './Model'

export enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

export interface Properties extends ModelProps {
    id: number,
    imageUrl: string,
    initialTotalizator: number,
    reportFilename: string,
    tank: Tank,
    tankId: number | null, //TODO move to tank property
    totalizator: number,
    uploadErrorMsg: string,
    uploadStatus: UploadStatus,
}

export default class Nozzle extends Model{

    properties: Properties = {
        id: -1,
        imageUrl: '',
        initialTotalizator: 0,
        reportFilename: '',
        tank: new Tank(),
        tankId: null,
        totalizator: 0,
        uploadErrorMsg: '',
        uploadStatus: UploadStatus.NONE
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

    getTotalizatorDiff(): number{
        return Math.abs(this.properties.totalizator - this.properties.initialTotalizator)
    }

    getRevenue(): number{
        return this.price * this.getTotalizatorDiff()
    }

    get id(){
        return this.properties.id
    }

    get tankId(){
        return this.properties.tankId
    }

    get initialTotalizator(){
        return this.properties.initialTotalizator
    }

    get totalizator(){
        return this.properties.totalizator
    }

    get props(){
        return this.properties
    }

    get productName(){
        return this.properties.tank.product.name
    }

    get imageUrl(){
        return this.properties.imageUrl
    }

    get price(){
        return this.properties.tank.product.price
    }

    get reportFilename(){
        return this.properties.reportFilename
    }

    set price(price: number){
        this.properties.tank.product.price = price
    }

    set productName(name: string){
        this.properties.tank.product.name = name
    }

    set imageUrl(url: string){
        this.properties.imageUrl = url
    }

    set reportFilename(filename: string){
        this.properties.reportFilename = filename
    }

    set totalizator(i: number){
        this.properties.totalizator = i
    }

    set initialTotalizator(i: number){
        this.properties.initialTotalizator = i
    }
}