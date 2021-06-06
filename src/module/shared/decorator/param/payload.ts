import { Args } from '@nestjs/graphql';
import { GraphQLScalarType } from 'graphql';

type TypeFn<T = unknown> = () => GraphQLScalarType | (new () => T);

export function Payload(): ParameterDecorator;

export function Payload(property: string): ParameterDecorator;

export function Payload(
  property: string,
  nullable: boolean,
): ParameterDecorator;

export function Payload<T>(
  property: string,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Payload<T>(
  property: string,
  nullable: boolean,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Payload(nullable: boolean): ParameterDecorator;

export function Payload<T>(
  nullable: boolean,
  typeFn: TypeFn<T>,
): ParameterDecorator;

export function Payload<T>(typeFn: TypeFn<T>): ParameterDecorator;

export function Payload(property?, nullable?, typeFn?): ParameterDecorator {
  if ('function' === typeof property) {
    return Payload(null, null, property);
  }

  if ('boolean' === typeof property) {
    return Payload(null, property, nullable);
  }

  property ??= 'payload';
  nullable ??= false;

  if ('function' === typeof nullable) {
    return Payload(property, false, nullable);
  }

  return Args(property, { nullable, type: typeFn });
}
