export const BREAKPOINT_MAX = 1500;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
};

export function breakpointSizes(options: { max?: boolean } = {}) {
  const sizes: string[] = [];

  if (options.max) {
    sizes.push(`(max-width: ${BREAKPOINT_MAX}px) 100vw`);
    sizes.push(`${BREAKPOINT_MAX}px`);
  } else {
    sizes.push('100vw');
  }

  return sizes.join(', ');
}
