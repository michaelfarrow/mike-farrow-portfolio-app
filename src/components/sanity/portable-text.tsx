import type {
  PortableTextMarkComponent,
  PortableTextProps,
  PortableTextTypeComponent,
} from '@portabletext/react';
import { PortableText as PortableTextReact } from '@portabletext/react';
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from '@portabletext/types';
import { SetOptional } from 'type-fest';

type TypedObject = SetOptional<PortableTextBlock, 'children'>;

export function PortableText<
  T extends TypedObject = PortableTextBlock,
  Blocks extends TypedObject = Exclude<T, { _type: 'block' }>,
  Marks extends PortableTextMarkDefinition = NonNullable<
    Extract<T, { markDefs?: PortableTextMarkDefinition[] }>['markDefs']
  >[number],
>({
  value,
  components,
}: {
  value: PortableTextProps<T>['value'];
  components?: {
    types?: {
      [key in Blocks['_type']]?: PortableTextTypeComponent<
        Extract<Blocks, { _type: key }>
      >;
    };
    marks?: {
      [key in Marks['_type']]?: PortableTextMarkComponent<
        Extract<Marks, { _type: key }>
      >;
    };
  };
}) {
  return <PortableTextReact value={value} components={components} />;
}
