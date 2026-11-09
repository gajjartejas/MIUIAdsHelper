import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let active = true;
    let receivedChange = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => {
      receivedChange = true;
      setReducedMotion(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (active && !receivedChange) setReducedMotion(enabled);
      })
      .catch(() => {});
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
};
