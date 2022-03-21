import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fees, FeesDocument } from '../fees/schemas/fees.schemas';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionsDocument,
} from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionsDocument>,
    @InjectModel(Fees.name)
    private feesModel: Model<FeesDocument>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const currency = createTransactionDto.currency;
      const fee_locale =
        createTransactionDto.currency_country ===
        createTransactionDto.payment_entity.country
          ? 'LOCL'
          : 'INTL';
      const fee_entity = createTransactionDto.payment_entity.type;
      const issuer = createTransactionDto.payment_entity.issuer;
      const entity_property = createTransactionDto.payment_entity.brand;
      const country = createTransactionDto.payment_entity.country;

      const fcs = this.transactionConfiguration(
        createTransactionDto.payment_entity,
      );
      let feeConfig;
      switch (fcs) {
        case 'visa-creditcard-intl':
          feeConfig = await this.feesConfig({
            currency,
            fee_entity,
            fee_locale,
          });
          break;
        case '*-creditcard-locl':
          feeConfig = await this.feesConfig({
            currency,
            fee_entity,
            fee_locale,
          });
          break;
        case '*-bankaccount-*':
          feeConfig = await this.feesConfig({
            currency,
            fee_entity,
            fee_locale,
          });
          break;
        case 'ussd-mtn-*':
          feeConfig = await this.feesConfig({
            currency,
            fee_entity,
            entity_property: issuer,
          });
          break;
        case '*-*-*':
          feeConfig = await this.feesConfig({
            currency,
            fee_entity: 'Every',
            fee_locale: 'Every',
          });
          break;
        default:
          throw new BadRequestException(
            `No fee configuration avaliable for transactions`,
          );
          break;
      }

      let appliedFeeID, appliedFeeValue;
      const amount = createTransactionDto.amount;

      switch (feeConfig.fee_type) {
        case 'PERC':
          appliedFeeID = feeConfig.fee_id;
          appliedFeeValue = Math.round(
            (feeConfig.fee_value / 100) * createTransactionDto.amount,
          );
          break;
        case 'FLAT_PERC':
          appliedFeeID = feeConfig.fee_id;
          appliedFeeValue = Math.round(
            feeConfig.fee_value +
              (feeConfig.flat_fee_perc / 100) * createTransactionDto.amount,
          );
          break;
        default:
          appliedFeeID = feeConfig.fee_id;
          appliedFeeValue = feeConfig.fee_value;
          break;
      }

      const chargeAmount = createTransactionDto.customer.bears_fee
        ? appliedFeeValue + amount
        : amount;
      const settlementAmount = createTransactionDto.customer.bears_fee
        ? amount
        : amount - appliedFeeValue;

      await this.transactionModel.create(createTransactionDto);
      return {
        appliedFeeID,
        appliedFeeValue,
        chargeAmount,
        settlementAmount,
      };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  async feesConfig({ currency, ...args }) {
    const feeConfig = await this.feesModel.findOne({ currency, ...args });
    if (!feeConfig) {
      throw new BadRequestException(
        `No fee configuration for ${currency} transactions.`,
      );
    }

    return feeConfig;
  }

  transactionConfiguration(feeConfig) {
    let config: string;
    if (feeConfig.brand === 'VISA' && feeConfig.type === 'CREDIT-CARD') {
      config = 'visa-creditcard-intl';
    } else if (
      feeConfig.brand === 'MASTERCARD' &&
      feeConfig.country === 'NG' &&
      feeConfig.type === 'CREDIT-CARD'
    ) {
      config = '*-creditcard-locl';
    } else if (
      feeConfig.brand === '' &&
      feeConfig.type === 'USSD' &&
      feeConfig.issuer === 'MTN'
    ) {
      config = 'ussd-mtn-*';
    } else if (
      feeConfig.brand === '' &&
      feeConfig.type === 'USSD' &&
      feeConfig.issuer !== 'MTN'
    ) {
      config = '*-*-*';
    } else if (
      feeConfig.brand !== '' &&
      feeConfig.country === 'NG' &&
      feeConfig.type === 'BANK-ACCOUNT'
    ) {
      config = '*-bankaccount-*';
    }
    return config;
  }
}
