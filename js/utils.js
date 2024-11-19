export const BASE_URL = "http://localhost:5294/api";

export function eventManager(fun) {
    let executing = false;
    return async () => {
        if (!executing) {
            executing = true;
            console.log("Ejecutando una funcion")
            await fun();
            setTimeout(() => { executing = false }, 2000);
        }
    }
}