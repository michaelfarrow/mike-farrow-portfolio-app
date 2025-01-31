import { get as _get } from 'lodash';
import { Get, Paths } from 'type-fest';

export function get<T extends object, P extends Paths<T>>(obj: T, path: P) {
  return _get(obj, path) as Get<T, Exclude<P, number>>;
}
