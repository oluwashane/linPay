export class CreateTransactionDto {
  amount: number;
  currency: string;
  currency_country: string;
  customer: {
    id: number;
    email_address: string;
    fullname: string;
    bears_fee: boolean;
  };
  payment_entity: {
    id: number;
    issuer: string;
    brand: string;
    number: string;
    six_id: number;
    type: string;
    country: string;
  };
}
