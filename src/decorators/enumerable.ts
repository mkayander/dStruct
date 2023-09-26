export function Enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor
  ) {
    if (descriptor) {
      descriptor.enumerable = value;
    } else {
      Object.defineProperty(target, propertyKey, {
        enumerable: value,
        writable: true,
        configurable: false,
      });
    }

    console.info("Enumerable: ", target, propertyKey, descriptor);
  };
}

// TODO: Migrate to TS5 TC39 decorators when possible
// export function Enumerable(value: boolean) {
//   return function (target: any, context: ClassFieldDecoratorContext<any, any>) {
//     context.addInitializer(function () {
//       Object.defineProperty(this, context.name, {
//         enumerable: value,
//       });
//     });
//   };
// }
