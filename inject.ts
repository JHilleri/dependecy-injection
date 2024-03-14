function isClass(obj: unknown): obj is new () => unknown {
  return typeof obj === "function" && /^class\s/.test(obj.toString());
}

type InjectionToken<T> = (new () => T) | (() => T) | { key: string };

type ProviderWithClass<T> = {
  provide: InjectionToken<unknown>;
  useClass: new () => T;
};
type ProviderWithFactory<T> = {
  provide: InjectionToken<unknown>;
  useFactory: () => T;
};
type ProviderWithValue<T> = { provide: InjectionToken<unknown>; useValue: T };
type Provider<T> =
  | ProviderWithClass<T>
  | ProviderWithFactory<T>
  | ProviderWithValue<T>;

export function injectionToken<T>(key: string): InjectionToken<T> {
  return {
    key: key,
  } as unknown as InjectionToken<T>;
}

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

export class Injector {
  #tokens = new Map<unknown, unknown>();
  factories = new Map<InjectionToken<unknown>, Provider<unknown>>();

  constructor(providers?: Provider<unknown>[]) {
    if (!providers) {
      return;
    }

    providers.forEach((provider) => {
      this.factories.set(provider.provide, provider);
    });
  }

  inject<T>(token: InjectionToken<T>): T {
    if (this.#tokens.has(token)) {
      return this.#tokens.get(token) as T;
    }

    const factory = this.factories.get(token);
    if (!factory) {
      if (typeof token !== "function") {
        throw new Error("No provider for " + token);
      }

      if (isClass(token)) {
        const instance = new token();
        this.#tokens.set(token, instance);
        return instance as T;
      }

      const instance = (token as () => T)();
      this.#tokens.set(token, instance);
      return instance as T;
    }

    if ("useClass" in factory) {
      const instance = new factory.useClass();
      this.#tokens.set(token, instance);
      return instance as T;
    }

    if ("useValue" in factory) {
      this.#tokens.set(token, factory.useValue);
      return factory.useValue as T;
    }

    const instance = factory.useFactory();
    this.#tokens.set(token, instance);
    return instance as T;
  }

  runInContext<T>(fn: () => T): T {
    const prevInjector = currentInjector;
    currentInjector = this;
    try {
      return fn();
    } finally {
      currentInjector = prevInjector;
    }
  }
}

const defaultInjector = new Injector([]);

let currentInjector = defaultInjector;

export function inject<T>(token: InjectionToken<T>): T {
  return currentInjector.inject(token);
}
