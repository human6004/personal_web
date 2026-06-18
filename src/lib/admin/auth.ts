import crypto from "node:crypto";

const tokenVersion = "v1";

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function verifyAdminPassword(input: string, expected: string) {
  if (!expected) {
    return false;
  }

  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export function createSessionToken(secret: string, maxAgeSeconds = 60 * 60 * 8) {
  const payload = JSON.stringify({
    v: tokenVersion,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds
  });
  const encoded = base64Url(payload);
  const signature = sign(encoded, secret);

  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined, secret: string) {
  if (!token || !secret) {
    return false;
  }

  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) {
    return false;
  }

  const expectedSignature = sign(encoded, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    return payload.v === tokenVersion && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function getAdminSecrets() {
  return {
    password: process.env.ADMIN_PASSWORD || "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET || ""
  };
}

export const adminCookieName = "personal_web_admin";
