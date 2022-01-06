import { OrderBy } from 'src/module/shared/input/order-by';
import { Filterable } from 'src/types';
import { Substructure } from 'src/module/shared/model/substructure';
import { BadRequestException } from '@nestjs/common';

export const isFieldsValid = <T extends Substructure>(
  orderBy: OrderBy<T>,
  validList: Filterable<T, number | string>[],
) => {
  if (null == orderBy) {
    return;
  }
  if (
    ![...['createdAt', 'updatedAt', 'deletedAt'], ...validList].includes(
      orderBy.field as any,
    )
  ) {
    throw new BadRequestException(orderBy.field + ' is not a valid property');
  }
};
