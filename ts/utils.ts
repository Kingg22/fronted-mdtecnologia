export const BASE_URL = "http://localhost:5294/api";

export function eventManager<T extends unknown[], R>(
  fun: (...args: T) => Promise<R>
): (...args: T) => Promise<void> {
  let executing = false;

  return async (...args: T): Promise<void> => {
    if (!executing) {
      executing = true;
      console.log("Ejecutando una función");
      try {
        await fun(...args);
      } finally {
        setTimeout(() => {
          executing = false;
        }, 2000);
      }
    }
  };
}
