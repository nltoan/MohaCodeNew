import { useState } from 'react';

export type LoadStatus = 'loading' | 'ready' | 'error';
type Settled = { key: string; status: 'ready' | 'error' };

/**
 * Loading status derived from a request key instead of being reset inside an effect.
 * The status is 'loading' until a request for the CURRENT key has settled; a change of
 * the key (route param, page, retry counter...) therefore shows 'loading' again without
 * any synchronous setState in the effect that fetches the data.
 * The effect reports the outcome with `settle({ key, status })` after its await.
 */
export function useSettledStatus(key: string): [LoadStatus, (settled: Settled) => void] {
  const [settled, setSettled] = useState<Settled | null>(null);
  return [settled?.key === key ? settled.status : 'loading', setSettled];
}
