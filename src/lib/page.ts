/* eslint-disable @typescript-eslint/no-explicit-any */
import { pascalCase } from 'change-case';

import { ReactNode } from 'react';

import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export function createPage<
  T extends (params: P) => Promise<{ data?: V }>,
  P = T extends (params: infer X) => any ? X : unknown,
  V = T extends (params: any) => Promise<{ data?: infer X }> ? X : unknown,
>(
  name: string,
  query: T,
  methods: {
    metadata: (data: V, parent: ResolvingMetadata) => Metadata | null;
    render: (data: V) => ReactNode | Promise<ReactNode>;
  }
) {
  type Params = { params: Promise<P> };

  const getData = async (params: Promise<P>) => {
    const { data } = await query(await params);
    return data;
  };

  const generateMetadata = async (
    { params }: Params,
    parent: ResolvingMetadata
  ) => {
    const data = await getData(params);
    if (!data) return null;
    return methods.metadata(data, parent);
  };

  const page = async ({ params }: Params) => {
    const data = await getData(params);
    if (!data) notFound();
    return await methods.render(data);
  };

  page.displayName = `${pascalCase(name)}Page`;

  return {
    generateMetadata,
    page,
  };
}
