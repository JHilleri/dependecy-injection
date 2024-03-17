import type { InjectionToken } from "./injection-token";

export type ProviderWithClass<T> = {
  provide: InjectionToken<unknown>;
  useClass: new () => T;
};
export type ProviderWithFactory<T> = {
  provide: InjectionToken<unknown>;
  useFactory: () => T;
};
export type ProviderWithValue<T> = {
  provide: InjectionToken<unknown>;
  useValue: T;
};
export type Provider<T> =
  | ProviderWithClass<T>
  | ProviderWithFactory<T>
  | ProviderWithValue<T>;

export type ProviderLike<T> =
  | Provider<T>
  | (() => unknown)
  | (new () => unknown);

export function providerWithValue<T>(
  token: InjectionToken<T>,
  value: T
): Provider<T> {
  return {
    provide: token,
    useValue: value,
  };
}

export function providerWithClass<T>(
  token: InjectionToken<T>,
  useClass: new () => T
): Provider<T> {
  return {
    provide: token,
    useClass: useClass,
  };
}

export function providerWithFactory<T>(
  token: InjectionToken<T>,
  useFactory: () => T
): Provider<T> {
  return {
    provide: token,
    useFactory: useFactory,
  };
}
