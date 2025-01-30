/* eslint-disable @typescript-eslint/no-explicit-any */
import type AlbumPage from '@/app/albums/[slug]/page';
import type ProjectPage from '@/app/projects/[slug]/page';

export const projectHref = pageHref<typeof ProjectPage>('projects/[slug]');
export const albumHref = pageHref<typeof AlbumPage>('albums/[slug]');

type Params = { [key: string]: string };

export function pageHref<T extends (...args: any) => any>(
  path: `${string}[${Extract<
    keyof (T extends (args: { params: Promise<infer X> }) => any ? X : unknown),
    string
  >}]${string}`
) {
  return <
    P extends Params = T extends (args: {
      params: Promise<infer X extends Params>;
    }) => any
      ? X
      : unknown,
  >(
    params: P
  ) => {
    let p: string = path;
    for (const [key, val] of Object.entries(params)) {
      p = p.replaceAll(`[${key}]`, val);
    }
    return p;
  };
}
