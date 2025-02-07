import { isEqual as deepEqual, mapValues, omitBy } from 'lodash';

import { FunctionComponent, memo as reactMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function is(x: any, y: any) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const objectIs: (x: any, y: any) => boolean =
  typeof Object.is === 'function' ? Object.is : is;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shallowEqual(objA: any, objB: any): boolean {
  if (objectIs(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (
      !Object.hasOwnProperty.call(objB, currentKey) ||
      !objectIs(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitize(o: any): any {
  if (Array.isArray(o)) return o.map(sanitize);
  if (typeof o === 'object')
    return mapValues(
      omitBy(o, (val) => typeof val === 'function'),
      sanitize
    );
  return o;
}

export function memo<P>(
  Component: FunctionComponent<P>,
  options?: { disable?: boolean; deep?: boolean; ignoreFunctions?: boolean }
) {
  if (options?.disable) return Component;
  return reactMemo(Component, (prev, next) => {
    const _prev = options?.ignoreFunctions ? sanitize(prev) : prev;
    const _next = options?.ignoreFunctions ? sanitize(next) : next;
    if (!options?.deep) return shallowEqual(_prev, _next);
    return deepEqual(_prev, _next);
  });
}
