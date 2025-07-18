import db from "./index";

export function transactional(): MethodDecorator {
  return (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: Parameters<typeof originalMethod>
    ) {
      return db.transaction(async (tx) => {
        return originalMethod.call(this, ...args, tx);
      });
    };

    return descriptor;
  };
}
