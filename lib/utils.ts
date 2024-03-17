import type { InjectionToken } from "./injection-token";
import type { Provider } from "./provider";

function isClass(obj: unknown): obj is new () => unknown {
  return typeof obj === "function" && /^class\s/.test(obj.toString());
}

export function normalizeProviders(
  providers: (Provider<unknown> | (() => unknown) | (new () => unknown))[]
) {
  return providers
    .flat()
    .map((provider) => {
      if (typeof provider === "object") {
        return provider;
      }

      if (isClass(provider)) {
        return {
          provide: provider,
          useClass: provider,
        };
      }

      if (typeof provider === "function") {
        return {
          provide: provider,
          useFactory: provider as () => unknown,
        };
      }
    })
    .filter(Boolean) as Provider<unknown>[];
}

export function instateWithClassOrFactory<T>(token: InjectionToken<T>): T {
  if (typeof token !== "function") {
    throw new Error("No provider for " + token);
  }

  if (isClass(token)) {
    return new token() as T;
  }

  return (token as () => T)() as T;
}

export function instanciateWithProvider<T>(provider: Provider<T>): T {
  if ("useClass" in provider) {
    return new provider.useClass();
  }

  if ("useValue" in provider) {
    return provider.useValue as T;
  }

  return provider.useFactory();
}
