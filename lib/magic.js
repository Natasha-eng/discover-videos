import { Magic } from "@magic-sdk/admin";

export const magicAdmin = await Magic.init(process.env.MAGIC_SERVER_KEY);
