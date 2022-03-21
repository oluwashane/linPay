import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeesDocument = Fees & Document;

@Schema()
export class Fees {
  @Prop({
    required: true,
    unique: true,
  })
  fee_id: string;

  @Prop()
  currency: string;

  @Prop()
  fee_locale: string;

  @Prop()
  fee_entity: string;

  @Prop()
  entity_property: string;

  @Prop()
  fee_type: string;

  @Prop()
  fee_value: number;

  @Prop()
  flat_fee_perc: number;
}

export const FeesSchema = SchemaFactory.createForClass(Fees);
