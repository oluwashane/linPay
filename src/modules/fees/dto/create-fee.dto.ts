export class CreateFeeObjectDto {
  fee_id: string;
  currency: string;
  fee_locale: string;
  fee_entity: string;
  entity_property: string;
  fee_type: string;
  fee_value: string;
}

export class CreateFeeDto {
  FeeConfigurationSpec: string;
}
