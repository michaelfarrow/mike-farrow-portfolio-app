import { SetRequiredDeep } from 'type-fest';

export type DocumentWithSlug = { slug?: { current?: string } };

export function hasSlug(
  o: DocumentWithSlug
): o is SetRequiredDeep<DocumentWithSlug, 'slug' | 'slug.current'> {
  return Boolean(o?.slug?.current);
}
