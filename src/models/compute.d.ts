export interface TrxResponse{
    APPLIEDFEE_ID: string,
    APPLIEDFEEVALUE:number,
    CHARGEAMOUNT:number,
    SETTLEAMOUMT: number
}

export interface TrxPayload{
    ID: number,
    Amount: number,
    Currency: string,
    CurrencyCountry: string,
    Customer: Customer,
    PaymentEntity:PaymentEntity
}

export interface Customer {
    ID: number,
    EmailAddress: string,
    FullName:string,
    BearsFee: boolean
}

export interface PaymentEntity {
    ID: number,
    Issuer: string,
    Brand: string,
    Number:string,
    SixID: number,
    Type: string,
    Country: string
}