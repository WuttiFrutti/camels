const production = process.env.NODE_ENV === "production";


const ssl = process.env.REACT_APP_HTTP_BACKEND_SSL == "true";


export const backendURL = production ? '/api' : (ssl ? "https://" : "http://") + window.location.hostname + ":" + (production ? window.location.port : process.env.REACT_APP_BACKEND_PORT) + process.env.REACT_APP_HTTP_BACKEND_PATH;
export const wsURL = production ? `wss://${window.location.hostname}:${window.location.port}/ws` : (ssl ? "wss://" : "ws://") + window.location.hostname + ":" + (production ? window.location.port : process.env.REACT_APP_BACKEND_PORT) + process.env.REACT_APP_WS_BACKEND_PATH;
