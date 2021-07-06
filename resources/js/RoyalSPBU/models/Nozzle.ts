
export enum UploadStatus {
    NONE,
    COMPRESSING,
    UPLOADING,
    ERROR,
    UPLOADED,
}

export interface INozzleData{
    id? : number,
    finalTotalizator?: number,
    imageUrl?: string,
    initialTotalizator?: number,
    price? : number,
    productName? : string,
    reportFilename? : string,
    uploadErrorMsg?: string,
    uploadProgress? : number,
    uploadStatus? : UploadStatus,
}

interface NozzleData {
    id : number,
    finalTotalizator: number,
    imageUrl: string,
    initialTotalizator: number,
    price : number,
    productName : string,
    reportFilename: string,
    uploadErrorMsg: string,
    uploadProgress : number,
    uploadStatus: UploadStatus,
}

export default class Nozzle{

    // public readonly id
    private _data: NozzleData = {
        id: -1,
        initialTotalizator: 0,
        imageUrl: '',
        finalTotalizator: 0,
        price: 0,
        productName: '',
        reportFilename: '',
        uploadErrorMsg: '',
        uploadProgress: -1,
        uploadStatus: UploadStatus.NONE,
    }

    constructor(data: INozzleData = {}){
        this._data = {
            ...this._data,
            ...data
        }
    }
    
    public get data() : NozzleData {return this._data}
    public get id() : number {return this._data.id}

    
    public set data(v : INozzleData) {
        this._data = {
            ...this._data,
            ...v
        };
    }

    public get totalizatorDifference() : number {
        return Math.abs(this._data.finalTotalizator - this._data.initialTotalizator)
    }
}