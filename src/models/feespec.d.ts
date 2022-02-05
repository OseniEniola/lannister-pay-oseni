export interface FeeSpec{
    FEE_ID: string,
    FEE_CURRENCY:string,
    FEE_LOCALE:string,
    FEE_ENTITY:string | number,
    ENTITY_PROP:any,
    FEE_TYPE: string,
    FEE_VALUE:string | number
    SPECITIVITY: number
}