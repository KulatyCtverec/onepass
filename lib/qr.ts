import crypto from "crypto";

export interface QRData {
  ticketId: string;
  eventId: string;
  userId: string;
  timestamp: number;
  hash: string;
}
const SECRET_KEY = process.env.QR_SECRET_KEY || "your-secret-key";

export const QR = {
  generateAccessCode: (ticketId: string, eventId: string, userId: string) => {
    const data = `${ticketId}:${eventId}:${userId}:${Date.now()}`;
    const hash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(data)
      .digest("hex");
    return hash.substring(0, 16).toUpperCase();
  },
  verifyQRCode: (
    accessCode: string,
    ticketId: string,
    eventId: string,
    userId: string
  ) => {
    const data = `${ticketId}:${eventId}:${userId}:${Date.now()}`;
    const hash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(data)
      .digest("hex");
    return hash.substring(0, 16) === accessCode;
  },
};

