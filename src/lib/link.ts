/* eslint-disable @typescript-eslint/no-explicit-any */

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
