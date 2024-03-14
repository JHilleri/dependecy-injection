import { expect, test } from "bun:test";
import {
  inject,
  Injector,
  injectionToken,
  providerWithValue,
  providerWithClass,
  providerWithFactory,
  runInContext,
} from "./lib";

function functionOk() {
  return true;
}

function functionKo() {
  return false;
}

const lambdaOk = () => true;
const lambdaKo = () => false;

class classOk {
  #result = true;
  test() {
    return this.#result;
  }
}

class classKo {
  test() {
    return false;
  }
}

const token = injectionToken<boolean>("test");

class CombinedDependency {
  #isAValide = inject(functionOk);
  #isBValide = inject(classOk).test();

  test() {
    return this.#isAValide && this.#isBValide;
  }
}

test("inject function", () => {
  const result = inject(functionOk);

  expect(result).toBeTrue();
});

test("inject class", () => {
  const instance = inject(classOk);
  const result = instance.test();

  expect(result).toBeTrue();
});

test("inject lambda", () => {
  const result = inject(lambdaOk);

  expect(result).toBeTrue();
});

test("inject unprovided token", () => {
  expect(() => inject(token)).toThrow("No provider for [object Object]");
});

test("inject provided token", () => {
  const injector = new Injector([providerWithValue(token, true)]);

  const result = injector.inject(token);

  expect(result).toBeTrue();
});

test("inject overridden function", () => {
  const injector = new Injector([providerWithValue(functionKo, true)]);

  const result = injector.inject(functionKo);

  expect(result).toBeTrue();
});

test("inject overridden class", () => {
  const injector = new Injector([
    providerWithClass(
      classKo,
      class implements classKo {
        test(): boolean {
          return true;
        }
      }
    ),
  ]);

  const instance = injector.inject(classKo);
  const result = instance.test();

  expect(result).toBeTrue();
});

test("inject overridden lambda", () => {
  const injector = new Injector([providerWithFactory(lambdaKo, () => true)]);

  const result = injector.inject(lambdaKo);

  expect(result).toBeTrue();
});

test("runInContext", () => {
  const injector = new Injector([providerWithValue(token, true)]);

  const result = runInContext(() => inject(token), injector);

  expect(result).toBeTrue();
});

test("combined dependency", () => {
  const result = runInContext(() => {
    return inject(CombinedDependency).test();
  });
  expect(result).toBeTrue();
});

test("instances are saved", () => {
  class Cache {
    #value = 0;
    getValue() {
      return this.#value;
    }
    increment() {
      this.#value++;
    }
  }

  const instance1 = inject(Cache);
  instance1.increment();
  const instance2 = inject(Cache);

  expect(instance1.getValue()).toBe(1);
  expect(instance2.getValue()).toBe(1);
});

test("parent injector", () => {
  const token = injectionToken<string>("test");
  const tokenFromParent = injectionToken<string>("test parent");

  const parentInjector = new Injector(
    [providerWithValue(token, "parent"), providerWithValue(tokenFromParent, "parent")],
    undefined
  );

  const childInjectorA = new Injector(
    [providerWithValue(token, "childA")],
    parentInjector
  );

  const resultA = runInContext(() => inject(token), childInjectorA);
  const resultParent = runInContext(() => inject(tokenFromParent), childInjectorA);

  expect(resultA).toBe("childA");
  expect(resultParent).toBe("parent");
});
