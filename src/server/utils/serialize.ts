// src/server/utils/serialize.ts

import { Decimal } from "../../../prisma/generated/prisma/runtime/client";

export type Serialized<T> = {
  [K in keyof T]: T[K] extends Decimal
    ? number
    : T[K] extends Date
      ? string
      : T[K] extends Array<infer U>
        ? Serialized<U>[]
        : T[K] extends object
          ? Serialized<T[K]>
          : T[K];
};

export function serialize<T>(value: T): Serialized<T> {
  return JSON.parse(
    JSON.stringify(value, (_, val) => {
      if (val instanceof Decimal) {
        return val.toNumber();
      }

      return val;
    }),
  );
}
