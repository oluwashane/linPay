import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fees, FeesSchema } from './schemas/fees.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fees.name, schema: FeesSchema }]),
  ],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [MongooseModule],
})
export class FeesModule {}
