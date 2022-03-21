import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { Fees, FeesDocument } from './schemas/fees.schemas';
import { convertToArray } from 'src/utils/helper';

@Injectable()
export class FeesService {
  constructor(
    @InjectModel(Fees.name)
    private feesModel: Model<FeesDocument>,
  ) {}

  async create(createFeeDto: CreateFeeDto) {
    // convert incoming data to array
    const convertIncomingData = convertToArray(
      createFeeDto.FeeConfigurationSpec,
    );

    for await (const data of convertIncomingData) {
      const createFees = await new this.feesModel(data);
      await createFees.save();
    }

    return {
      status: 'Ok',
    };
  }

  findAll() {
    return this.feesModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} fee`;
  }
}
