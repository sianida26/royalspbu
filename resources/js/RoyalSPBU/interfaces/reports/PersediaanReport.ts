export interface IPersediaanReport{
    id: number,
    initialStock: number,
    penerimaan: IPenerimaan | null,
    product: string,
    tankId: number,
    tankName: string,
    theoriticalStock: number,
    actualStock: number,
    volumeOut: number,
    reporter: string,
}

export interface IPenerimaan{
    actualVolume: number,
    initialVolume: number,
    pnbp: string,
    pnbpVolume: number,
    truckId: string,
    volumeDiff: number,
}