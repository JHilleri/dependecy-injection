import { createMiddleware } from "hono/factory";
import { Injector, type ProviderLike } from "module/dependency-injection";

export function requestInjector(providers: ProviderLike<unknown>[]) {
  return createMiddleware(async (_, next) => {
    const injector = new Injector(providers);

    injector.runInContext(async () => await next());
  });
}

export function globalInjector(injector: Injector) {
  return createMiddleware(async (_, next) => {
    injector.runInContext(async () => await next());
  });
}
