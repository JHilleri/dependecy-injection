import type { InjectionToken } from "./injection-token";
import type { Provider, ProviderLike } from "./provider";
import {
  instateWithClassOrFactory,
  normalizeProviders,
  instanciateWithProvider,
} from "./utils";

let currentInjector: Injector | undefined = undefined;

export class Injector {
  #instances = new Map<unknown, unknown>();
  #providers = new Map<InjectionToken<unknown>, Provider<unknown>>();
  #parent: Injector | undefined;

  constructor(providers?: ProviderLike<unknown>[], parent?: Injector) {
    this.#parent = parent ?? currentInjector;

    if (providers) {
      for (const provider of normalizeProviders(providers)) {
        this.#providers.set(provider.provide, provider);
      }
    }
  }

  get parent(): Injector | undefined {
    return this.#parent;
  }

  hasInstance(token: InjectionToken<unknown>): boolean {
    if (this.#providers.has(token) || this.#instances.has(token)) {
      return true;
    }

    if (this.#parent) {
      return this.#parent.hasInstance(token);
    }

    return false;
  }

  hasProvider(token: InjectionToken<unknown>): boolean {
    if (this.#providers.has(token)) {
      return true;
    }

    if (this.#parent) {
      return this.#parent.hasProvider(token);
    }

    return false;
  }

  inject<T>(token: InjectionToken<T>): T {
    if (this.#instances.has(token)) {
      return this.#instances.get(token) as T;
    }

    const provider = this.#providers.get(token);
    if (provider) {
      const instance = instanciateWithProvider(provider) as T;
      this.#instances.set(token, instance);
      return instance;
    }

    if (this.#parent?.hasProvider(token)) {
      return this.#parent?.inject(token) as T;
    }

    if (this.#parent?.hasInstance(token)) {
      return this.#parent.getInstance(token) as T;
    }

    const instance = instateWithClassOrFactory(token);
    this.#instances.set(token, instance);
    return instance;
  }

  getInstance<T>(token: InjectionToken<T>): T | undefined {
    if (this.#instances.has(token)) {
      return this.#instances.get(token) as T;
    }

    if (this.#parent) {
      return this.#parent.getInstance(token);
    }

    return undefined;
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

export function inject<T>(token: InjectionToken<T>): T {
  if (currentInjector === undefined) {
    throw new Error("inject must be called within an injection context.");
  }

  return currentInjector.inject(token);
}

export function runInInjectionContext<T>(fn: () => T, injector?: Injector): T {
  return (injector ?? currentInjector ?? defaultInjector)?.runInContext<T>(fn);
}

export function runOutsideInjectionContext<T>(fn: () => T): T {
  const prevInjector = currentInjector;
  currentInjector = undefined;
  try {
    return fn();
  } finally {
    currentInjector = prevInjector;
  }
}
