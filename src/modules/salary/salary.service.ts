import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { Injectable } from '@nestjs/common';
import { SalaryModel } from './models/salary.model';

@Injectable()
export class SalaryService {
  constructor(
    @InjectModel(SalaryModel)
    private readonly salaryModel: MongooseModel<SalaryModel>,
  ) {}
}
