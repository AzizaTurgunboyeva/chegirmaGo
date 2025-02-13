import { Injectable } from '@nestjs/common';
import { CreateDiscountTypeDto } from './dto/create-discount-type.dto';
import { UpdateDiscountTypeDto } from './dto/update-discount-type.dto';
import { InjectModel } from '@nestjs/sequelize';
import { DiscountType } from './models/discount-type.model';

@Injectable()
export class DiscountTypeService {
  constructor(@InjectModel(DiscountType) private readonly discountTypeModel:typeof DiscountType){}
  create(createDiscountTypeDto: CreateDiscountTypeDto) {
    return this.discountTypeModel.create(createDiscountTypeDto)
  }

  findAll() {
    return this.discountTypeModel.findAll()
  }

  findOne(id: number) {
    return this.discountTypeModel.findByPk(id)
  }

  async update(id: number, updateDiscountTypeDto: UpdateDiscountTypeDto) {
     const updated= await this.discountTypeModel.update(updateDiscountTypeDto,{
      where:{id},
      returning:true

    })
    return updated[1][0]}

  remove(id: number) {
    return this.discountTypeModel.destroy({where:{id}})
  }
}
