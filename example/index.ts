import { Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";
import { Session, SessionData, MyContext } from "./types";
import registration from "./registration";

if (!process.env.BOT_TOKEN) throw new Error("ENV: No BOT_TOKEN");

const localSession = new LocalSession<Session<SessionData>>({
  database: "sessions.json",
  storage: LocalSession.storageFileSync
});

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN);

bot.use(localSession.middleware());
bot.use(registration.middleware());
bot.launch();