const ssl = process.env.REACT_APP_HTTP_BACKEND_SSL == "true";


const production = process.env.NODE_ENV === "production";
export const backendURL = (ssl ? "https://" : "http://") + window.location.hostname + ":" + (production ? window.location.port : process.env.REACT_APP_BACKEND_PORT) + process.env.REACT_APP_HTTP_BACKEND_PATH;
export const wsURL = (ssl ? "wss://" : "ws://") + window.location.hostname + ":" + (production ? window.location.port : process.env.REACT_APP_BACKEND_PORT) + process.env.REACT_APP_WS_BACKEND_PATH;
