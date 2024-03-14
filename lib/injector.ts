import type { InjectionToken } from "./injection-token";
import type { Provider } from "./provider";

function isClass(obj: unknown): obj is new () => unknown {
  return typeof obj === "function" && /^class\s/.test(obj.toString());
}

export class Injector {
  #tokens = new Map<unknown, unknown>();
  factories = new Map<InjectionToken<unknown>, Provider<unknown>>();
  #parent: Injector | undefined;

  constructor(providers?: Provider<unknown>[], parent?: Injector) {
    this.#parent = parent;

    if (!providers) {
      return;
    }

    providers.forEach((provider) => {
      this.factories.set(provider.provide, provider);
    });
  }

  get parent(): Injector | undefined {
    return this.#parent;
  }

  inject<T>(token: InjectionToken<T>): T {
    if (this.#tokens.has(token)) {
      return this.#tokens.get(token) as T;
    }

    const factory = this.factories.get(token);
    if (!factory) {
      if (this.#parent) {
        return this.#parent.inject(token);
      }

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
}
