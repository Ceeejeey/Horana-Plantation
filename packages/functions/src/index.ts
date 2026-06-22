import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { createApp } from "./app";

setGlobalOptions({
  region: "us-central1",
  maxInstances: 10,
});

const app = createApp();

/** Single HTTPS function — Firebase Hosting rewrites /api/** here. */
export const api = onRequest({ cors: true }, app);
