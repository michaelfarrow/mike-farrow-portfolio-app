import { isMaybePresentation as sanityIsMaybePresentation } from '@sanity/presentation-comlink';

import { useEffect, useState } from 'react';

export function useIsMaybePresentation() {
  const [current, setCurrent] = useState(false);
  useEffect(() => {
    setCurrent(sanityIsMaybePresentation());
  }, []);
  return current;
}
