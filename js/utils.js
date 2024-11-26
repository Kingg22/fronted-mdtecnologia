export const BASE_URL = "http://localhost:5294/api";
export function eventManager(fun) {
    let executing = false;
    return async (...args) => {
        if (!executing) {
            executing = true;
            try {
                await fun(...args);
            }
            finally {
                setTimeout(() => {
                    executing = false;
                }, 2000);
            }
        }
    };
}
