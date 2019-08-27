export type Transaction = {
    fromAddress: string;
    toAddress: string;
    amount: number;
    timestamp: string;
}

export type AddressInfo = {
    balance: number;
    transactions: Array<Transaction>;
}

export type MixResponse = {
    depositAddress: string;
    expiryDate: string;
}