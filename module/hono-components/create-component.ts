import type { FC, PropsWithChildren } from "hono/jsx";
import { runOutsideInjectionContext } from "module/dependency-injection";

export function createComponent<T = PropsWithChildren>(factory: () => FC<T>) {
    return () => {
        const Component = factory();

        return (props: T) => {
            return runOutsideInjectionContext(() => Component(props));
        };
    };
}
