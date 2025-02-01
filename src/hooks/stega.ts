import { mapValues } from 'lodash';
import { stegaClean } from 'next-sanity';

import { useContext } from 'react';

import { StegaContext } from '@/context/stega';

export function useStega() {
  return useContext(StegaContext);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processObject = (o?: any): any => {
  if (!o) return o;
  if (typeof o === 'string') return stegaClean(o);
  if (Array.isArray(o)) return o.map(processObject);
  if (typeof o === 'object') {
    return mapValues(o, processObject);
  }
  return o;
};

export function useStegaValue<T>(result: T): T {
  const stega = useStega();
  if (result === undefined) return result;
  return stega === false ? processObject(result) : result;
}
