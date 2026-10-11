function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`);
  }
  return value;
}

export const env = {
  get MONGODB_URI() {
    return required("MONGODB_URI");
  },
  get MONGODB_DB() {
    return process.env.MONGODB_DB || "attendance";
  },
  get ADMIN_PASSWORD() {
    return required("ADMIN_PASSWORD");
  },
  get AUTH_SECRET() {
    const secret = required("AUTH_SECRET");
    if (secret.length < 32) throw new Error("AUTH_SECRET must be at least 32 characters.");
    return secret;
  },
  get APP_TIMEZONE() {
    return process.env.APP_TIMEZONE || "UTC";
  },
};
