import { Injector, injectionToken, inject, runInInjectionContext } from "module/dependency-injection";

class TestClass {
  test() {
    console.log("Hello from TestClass");
  }
}

function testFunction() {
  return {
    test: () => console.log("Hello from testFunction"),
  };
}

const testToken = injectionToken<{ content: string }>("message");

runInInjectionContext(() => inject(TestClass).test());

runInInjectionContext(() => inject<{ test: () => void }>(testFunction).test());

function printTestTokenContent(content = inject(testToken).content) {
  console.log("testTokenContent", content);
}

console.log("overiden");
const customInjector = new Injector([
  {
    provide: TestClass,
    useValue: {
      test: () => console.log("Hello from customInjector"),
    },
  },
  {
    provide: testToken,
    useValue: {
      content: "test token value",
    },
  },
]);

customInjector.inject(TestClass).test();

runInInjectionContext(printTestTokenContent, customInjector);

const parentInjector = new Injector([TestClass]);
const childInjector = new Injector([], parentInjector);

const instance = runInInjectionContext(() => inject(TestClass), childInjector);
