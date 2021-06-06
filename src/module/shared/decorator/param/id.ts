import { ID } from '@nestjs/graphql';
import { Payload } from './payload';

export function Id(): ParameterDecorator;
export function Id(property: string): ParameterDecorator;
export function Id(nullable: boolean): ParameterDecorator;
export function Id(property: string, nullable: boolean): ParameterDecorator;
export function Id(
  property?: string | boolean,
  nullable?: boolean,
): ParameterDecorator {
  if ('boolean' === typeof property) {
    return Id(null, property);
  }

  property ??= 'id';

  return Payload(property, nullable, () => ID);
}
