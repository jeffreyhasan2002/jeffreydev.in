import { useEffect, useState } from 'react';

const readSize = () => (typeof window === 'undefined' ? { width: undefined, height: undefined } : { width: window.innerWidth, height: window.innerHeight });

// Debounced window size. Replaces `useWindowSize` from the deprecated @darkroom.engineering/hamo.
function useWindowSize(debounce = 150) {
  const [size, setSize] = useState(readSize);

  useEffect(() => {
    let timeout;

    const update = () => {
      setSize((prev) => {
        const next = readSize();
        return prev.width === next.width && prev.height === next.height ? prev : next;
      });
    };

    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, debounce);
    };

    update();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, [debounce]);

  return size;
}

export default useWindowSize;
