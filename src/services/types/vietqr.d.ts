declare module 'vietqr' {
  export class VietQR {
    constructor(config: { clientID?: string; apiKey?: string });

    getTemplate(): Promise<any>;
    getBanks(): Promise<any>;

    genQRCodeBase64(params: {
      bank?: string;
      accountName?: string;
      accountNumber?: string;
      amount?: string | number;
      memo?: string;
      template?: string;
    }): Promise<any>;

    genQRCodeBase64V1(params: {
      bank?: string;
      accountName?: string;
      accountNumber?: string;
      amount?: string | number;
      memo?: string;
      format?: string;
    }): Promise<any>;

    genQuickLink(params: {
      bank?: string;
      accountName?: string;
      accountNumber?: string;
      amount?: string | number;
      memo?: string;
      template?: string;
      media?: string;
    }): string;

    createPaymentGateway(params: {
      theme_slug: string;
      platform?: string;
      bankId?: string;
      accountName?: string;
      accountNumber?: string;
      addInfo?: string;
      amount?: string | number;
    }): Promise<any>;
  }
}
