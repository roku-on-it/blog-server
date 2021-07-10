import { Args } from '@nestjs/graphql';
import { GraphQLScalarType } from 'graphql';

type TypeFn<T = unknown> = () => GraphQLScalarType | (new () => T);

export function Filter(): ParameterDecorator;

export function Filter(property: string): ParameterDecorator;

export function Filter(property: string, nullable: boolean): ParameterDecorator;

export function Filter<T>(
  property: string,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Filter<T>(
  property: string,
  nullable: boolean,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Filter(nullable: boolean): ParameterDecorator;

export function Filter<T>(
  nullable: boolean,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Filter<T>(typeFn: TypeFn<T>): ParameterDecorator;

export function Filter(property?, nullable?, typeFn?): ParameterDecorator {
  if ('function' === typeof property) {
    return Filter(null, null, property);
  }

  if ('boolean' === typeof property) {
    return Filter(null, property, nullable);
  }

  property ??= 'filter';
  nullable ??= true;

  if ('function' === typeof nullable) {
    return Filter(property, true, nullable);
  }

  return Args(property, { nullable, type: typeFn });
}
