import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionsDocument = Transaction & Document;

@Schema()
class Customer {
  @Prop()
  id: number;
  @Prop()
  email_address: string;
  @Prop()
  fullname: string;
  @Prop()
  bears_fee: boolean;
}

const customerSchema = SchemaFactory.createForClass(Customer);

@Schema()
class PaymentEntity {
  @Prop()
  id: number;
  @Prop()
  issuer: string;
  @Prop()
  brand: string;
  @Prop()
  number: string;
  @Prop()
  six_id: number;
  @Prop()
  type: string;
  @Prop()
  country: string;
}

const paymentEntitySchema = SchemaFactory.createForClass(PaymentEntity);

@Schema()
export class Transaction {
  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  currency_country: string;

  @Prop({ type: customerSchema })
  customer: Customer;

  @Prop({ type: paymentEntitySchema })
  payment_entity: PaymentEntity;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transaction);
