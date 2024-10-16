const axios = require("axios");
const cheerio = require("cheerio");
const { Telegraf } = require("telegraf");

const token = "7737288371:AAH8-cW98QNnmimQup2Ou33bpbOTDQ0z86s";
const bot = new Telegraf(token);

async function main() {
  bot.start(async (ctx) => {
    return ctx.reply("Olá :)");
  });

  bot.hears(/divulgadorinteligente.com/i, getLowestPrice);

  bot.launch();
  console.log("bot is listening...");
}

async function getLowestPrice(ctx) {
  const { message } = ctx.update;
  const url = message.text;

  await ctx.reply("Buscando dados...");
  const response = await axios.get(url);

  // Use o Cheerio para converter html em DOM
  const $ = cheerio.load(response.data);

  // armazenar os planos
  const planos = []

  // coleta todos os planos disponives na classe head
  $('.col-md-4').each((index, element) => {
    const nome = $(element).find('.head').text().trim(); // procura o nome de cada plano
    const priceString = $(element).find('.currency').text(); // procura o preço mas no tipo string
    const price = parseFloat(priceString.replace(/[R$.,]/g, '').trim()); // converte a string para um número

    console.log(nome,priceString,price)

    planos.push({ nome, price }); // adiciona o objeto a lista de planos  
  });

  const lowestPlan = planos.reduce((prev, curr) => {
    return (prev.price < curr.price) ? prev : curr;
  });

  await ctx.reply(
    `O plano pago mais barato é o "${lowestPlan.nome}" e custa "R$ ${lowestPlan.price.toFixed(2)}."`
  );
}

main();