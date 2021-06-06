import { Transform, TransformOptions } from 'class-transformer';

export const Trim = (sweep = true, options?: TransformOptions) =>
  Transform(({ value }) => {
    if ('string' === typeof value) {
      if (sweep) {
        value = value.replace(/\s+/g, ' ');
      }

      return value.trim();
    }

    return value;
  }, options);
