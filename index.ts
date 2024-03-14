import { Injector, injectionToken, inject } from "./inject";

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

inject(TestClass).test();

inject<{ test: () => void }>(testFunction).test();

function printTestTokenContent(content = inject(testToken).content) {
  console.log('testTokenContent', content);
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

customInjector.runInContext(printTestTokenContent);
