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
export function alertRedireccion(url, message, timeout = 5000) {
    const alert = document.createElement("div");
    alert.className = "alert alert-info";
    alert.role = "alert";
    alert.textContent = `${message}. Serás redirigido en ${timeout / 1000} segundos...`;
    document.body.prepend(alert);
    setTimeout(() => window.location.replace(url), timeout);
}
export function alert(message, type = "info", timeout = 10000) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = "alert";
    alert.textContent = message;
    document.body.prepend(alert);
    setTimeout(() => alert.remove(), timeout);
}
