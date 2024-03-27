import type { FC } from "hono/jsx";
import {
  inject,
  runOutsideInjectionContext,
  type ProviderLike,
} from "module/dependency-injection";
import { createFactory } from "hono/factory";
import { requestInjector } from "../../app/hono_server/injection-middleware";
import { TITLE } from "../../app/hono_server/utils";

const factory = createFactory();
type RouteConfig = {
  title?: string;
  providers?: ProviderLike<unknown>[];
};

export function renderComponent(component: () => FC, config?: RouteConfig) {
  const titleProvider = config?.title
    ? [{ provide: TITLE, useValue: config.title }]
    : [];

  return factory.createHandlers(
    requestInjector([...titleProvider, ...(config?.providers ?? [])]),
    (context) => {
      const Component = inject(component);

      return runOutsideInjectionContext(() => {
        const params = context.req.param();

        return context.html(Component(params ?? {}));
      });
    }
  );
}
