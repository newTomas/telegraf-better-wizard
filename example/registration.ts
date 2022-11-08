import { Scenes } from "telegraf";
import { BetterWizardScene } from "../lib";
import { MyContext } from "./types";

const checkIfRegistered = new Scenes.BaseScene<MyContext>("checkIfRegistered");
checkIfRegistered.enter(async ctx => {
  if (ctx.session.registrationComplete) return await ctx.reply("You already registered!");
  ctx.wizard.enter("askFirstName"); //You can call scene by id
});

const askFirstName = new Scenes.BaseScene<MyContext>("askFirstName");
askFirstName.enter(async ctx => {
  if (ctx.scene.session.firstName) return await ctx.wizard.next(); //You can call next scene in wizard
  await ctx.reply("Enter first name");
});
askFirstName.on("text", ctx => {
  ctx.scene.session.firstName = ctx.message.text;
  ctx.wizard.next();
});

const askLastName = new Scenes.BaseScene<MyContext>("askLastName");
askLastName.enter(async ctx => {
  if (ctx.scene.session.lastName) return await ctx.wizard.next(); //You can call next scene in wizard
  await ctx.reply("Enter last name");
});
askLastName.on("text", ctx => {
  ctx.scene.session.lastName = ctx.message.text;
  ctx.wizard.next();
});

const askAge = new Scenes.BaseScene<MyContext>("askAge");
askAge.enter(async ctx => {
  if (ctx.scene.session.age) return await ctx.wizard.next(); //You can call next scene in wizard
  await ctx.reply("Enter age");
});
askAge.on("text", async ctx => {
  if (isNaN(+ctx.message.text)) return await ctx.reply("Please enter number");
  ctx.scene.session.age = +ctx.message.text;
  ctx.wizard.next();
});

const confirmation = new Scenes.BaseScene<MyContext>("confirmation");
confirmation.enter(async ctx => {
  await ctx.reply(`Please confirm data:
first name: ${ctx.scene.session.firstName}
last name: ${ctx.scene.session.lastName}
age: ${ctx.scene.session.age}`, {
    reply_markup: {
      inline_keyboard: [[
        { text: "Accept", callback_data: "accept" },
        { text: "Edit", callback_data: "edit" },
      ]]
    }
  });
});
confirmation.action("accept", async ctx => {
  ctx.session.registrationComplete = true;
  await ctx.reply("ok");
});
confirmation.action("edit", async ctx => {
  delete ctx.scene.session.firstName;
  delete ctx.scene.session.lastName;
  delete ctx.scene.session.age;

  ctx.wizard.selectStep(0); //You can select step by index
});

const scene = new BetterWizardScene<MyContext>("registration", checkIfRegistered, askFirstName, askLastName, askAge, confirmation);

export default scene;