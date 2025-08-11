import crypto from "crypto";

export interface QRData {
  ticketId: string;
  eventId: string;
  userId: string;
  timestamp: number;
  hash: string;
}

const SECRET_KEY = process.env.QR_SECRET_KEY || "your-secret-key";

/**
 * Třída QR obsahuje statické metody pro generování a ověřování QR kódů pro vstupenky.
 * Všechny metody jsou statické, protože nepotřebujeme instanciovat objekt.
 */

export const QR = {
  generateAccessCode: (ticketId: string, eventId: string, userId: string) => {
    const data = `${ticketId}:${eventId}:${userId}:${Date.now()}`;
    const hash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(data)
      .digest("hex");

    // Vytvoříme kratší, čitelnější kód (16 znaků)
    return hash.substring(0, 16).toUpperCase();
  },
  generateQRData: (ticketId: string, eventId: string, userId: string) => {
    const timestamp = Date.now();
    const data = `${ticketId}:${eventId}:${userId}:${timestamp}`;
    const hash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(data)
      .digest("hex");

    return {
      ticketId,
      eventId,
      userId,
      timestamp,
      hash: hash.substring(0, 16),
    };
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
  decodeQRData: (qrString: string) => {
    try {
      return JSON.parse(qrString) as QRData;
    } catch {
      return null;
    }
  },
};
