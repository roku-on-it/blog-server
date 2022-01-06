import { registerEnumType } from '@nestjs/graphql';

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Direction, {
  name: 'Direction',
  description: 'Order by direction, either ascending or descending',
});
