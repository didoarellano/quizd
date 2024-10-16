import { customAlphabet } from "nanoid";

export const generatePIN = customAlphabet("0123456789", 6);
