export type InjectionToken<T> = (new () => T) | (() => T) | { key: string };

export function injectionToken<T>(key: string): InjectionToken<T> {
  return {
    key: key,
  } as unknown as InjectionToken<T>;
}
