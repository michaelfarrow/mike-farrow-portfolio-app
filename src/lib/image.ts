import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import numToFraction from 'num2fraction';

import type { CommonSchemaType } from '@/types/content';

import { romanize } from '@/lib/number';
import { client } from '@/lib/sanity/client';

const builder = imageUrlBuilder(client);

type UnknownImageData = {
  [key: string]: number | string | undefined;
};

export type ExifData = {
  camera?: string;
  lens?: string;
  settings: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    exposureCompensation?: string;
  };
};

export function imageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export function processExif<T>(
  transform: (v: string | number) => T | undefined
) {
  return <R>(v: string | number | undefined, process: (v: T) => R) => {
    if (v === undefined) return undefined;
    const t = transform(v);
    if (t === undefined) return undefined;
    return process(t);
  };
}

export const processExifString = processExif((v) => String(v));
export const processExifNumber = processExif((v) => {
  const t = Number(v);
  return isNaN(t) ? undefined : t;
});

export function getExifData(
  source: CommonSchemaType<'image'>
): ExifData | null {
  const { image = {}, exif = {} } =
    (source.asset?.metadata as {
      image?: UnknownImageData;
      exif?: UnknownImageData;
    }) || {};

  if (!Object.keys(image).length && !Object.keys(exif).length) return null;

  const { Model: model } = image;

  const {
    LensModel: lens,
    FocalLength: focalLength,
    ExposureTime: exposure,
    FNumber: aperture,
    ISO: iso,
    ExposureCompensation: exposureCompensation,
  } = exif;

  return {
    camera: processExifString(model, (model) =>
      model.replace(
        /[mM](\d+)/g,
        ({}, digit: string) => ` Mark ${romanize(Number(digit))}`
      )
    ),
    lens: processExifString(lens, (lens) =>
      lens.replace(/(?<=RF)(?=\d)/g, ' ')
    ),
    settings: {
      aperture: processExifNumber(aperture, (aperture) => `f/${aperture}`),
      shutterSpeed: processExifNumber(exposure, (exposure) =>
        exposure < 1 ? numToFraction(exposure) : `${exposure}"`
      ),
      iso: processExifNumber(iso, (iso) => `ISO${iso}`),
      focalLength: processExifNumber(
        focalLength,
        (focalLength) => `${focalLength}mm`
      ),
      exposureCompensation: processExifNumber(
        exposureCompensation,
        (exposureCompensation) =>
          `${Number(exposureCompensation) < 0 ? '-' : '+'}${Math.abs(
            Number(exposureCompensation)
          )} EV`
      ),
    },
  };
}
