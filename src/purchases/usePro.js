// Convenience hook for reading Pro status.
//
//   const { isPro } = usePro();
//   if (!isPro) navigation.navigate('Paywall');           // gate a screen
//   navigation.navigate('Paywall', { unlock: 'VsLastWeek' }); // auto-open after purchase
//
// The paywall itself is src/screens/Paywall.js, presented as a modal.

import { useStore } from '../state/store';

export function usePro() {
  const isPro = useStore((s) => s.isPro);
  return { isPro };
}
