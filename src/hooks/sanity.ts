import { useEffect, useState } from 'react';

export function useIsStudioEmbed() {
  const [isStudioEmbed, setIsStudioEmbed] = useState(false);

  useEffect(() => {
    setIsStudioEmbed(window.self !== window.top);
  }, []);

  return isStudioEmbed;
}
