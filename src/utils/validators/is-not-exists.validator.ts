import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@ValidatorConstraint({ name: 'IsNotExist', async: true })
@Injectable()
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const currentValue = validationArguments.object as ValidationEntity;

    const entity = (await this.dataSource.getRepository(repository).findOne({
      where: {
        [validationArguments.property]: value,
      },
    })) as ValidationEntity;

    if (entity?.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}
