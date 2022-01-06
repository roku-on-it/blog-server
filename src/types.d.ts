type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export declare type Filterable<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export declare type BaseTypes = string | number | Date;
