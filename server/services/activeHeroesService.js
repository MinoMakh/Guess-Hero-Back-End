const repository = require("../repositories/heroRepository");

let activeHeroes = [];
let todayHeroes = {
  classic: null,
  quotes: null,
  arts: null,
  emojis: null,
};

// Get today's heroes
function getTodayHeros() {
  return todayHeroes || null;
}

// Function to calculate the time until the next midnight in UTC+2
function timeUntilMidnightUTC2() {
  const now = new Date();
  const utcOffset = 2;
  const currentUTC2 = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);

  const nextMidnightUTC2 = new Date(
    currentUTC2.getFullYear(),
    currentUTC2.getMonth(),
    currentUTC2.getDate() + 1,
    0,
    0,
    0,
    0
  );

  return nextMidnightUTC2 - currentUTC2;
}

// Function to update today's heroes
async function updateTodayHeroes() {
  console.log("Updating today's heroes...");

  // Remove old heroes from activeHeroes
  activeHeroes = activeHeroes.filter(
    (hero) => !Object.values(todayHeroes).flat().includes(hero)
  );

  while (activeHeroes.length < 20) {
    const hero = await repository.fetchRandomHero();
    addHero(hero);
  }

  const shuffled = [...activeHeroes].sort(() => Math.random() - 0.5);

  todayHeroes.classic = shuffled.slice(0, 1);
  todayHeroes.quotes = shuffled.slice(1, 2);
  todayHeroes.arts = shuffled.slice(2, 3);
  todayHeroes.emojis = shuffled.slice(3, 4);

  console.log(
    "Today's heroes updated:",
    Object.keys(todayHeroes)
      .map((mode) => `${mode}: ${todayHeroes[mode].map((h) => h.name)}`)
      .join(", ")
  );

  // Schedule the next update at the next midnight UTC+2
  setTimeout(updateTodayHeroes, timeUntilMidnightUTC2());
}

// Adds a hero while maintaining activeHeroes <= 30
function addHero(hero) {
  if (activeHeroes.some((h) => h.name === hero.name)) return false;

  hero.selectedSplashArtIndex = hero.splashArts
    ? Math.floor(Math.random() * hero.splashArts.length)
    : 0;
  hero.quotes.sort(() => Math.random() - 0.5);
  hero.hints.sort(() => Math.random() - 0.5);

  activeHeroes.push(hero);
  while (activeHeroes.length > 30) activeHeroes.shift();

  return true;
}

updateTodayHeroes();

// Start the update process at the next midnight UTC+2
setTimeout(updateTodayHeroes, timeUntilMidnightUTC2());

module.exports = { getTodayHeros };
