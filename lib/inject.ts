import type { InjectionToken } from "./injection-token";
import { Injector } from "./injector";

const defaultInjector = new Injector([]);

let currentInjector = defaultInjector;

export function inject<T>(token: InjectionToken<T>): T {
  return currentInjector.inject(token);
}

export function runInContext<T>(fn: () => T, injector?: Injector): T {
  const prevInjector = currentInjector;
  currentInjector = injector ?? currentInjector;
  try {
    return fn();
  } finally {
    currentInjector = prevInjector;
  }
}
