const repository = require("../repositories/heroRepository");
const logger = require("../utils/logger");

let activeHeroes = [];
let todayHeroes = {
  classic: null,
  quotes: null,
  arts: null,
  emojis: null,
};

// Get today's heroes
function getTodayHeros() {
  logger.info("Fetching today's heroes.");
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

  logger.info(`Calculated time until next midnight UTC+2: ${nextMidnightUTC2 - currentUTC2} ms.`);
  return nextMidnightUTC2 - currentUTC2;
}

// Function to update today's heroes
async function updateTodayHeroes() {
  logger.info("Updating today's heroes...");

  // Remove old heroes from activeHeroes
  activeHeroes = activeHeroes.filter(
    (hero) => !Object.values(todayHeroes).flat().includes(hero)
  );
  logger.info("Removed old heroes from activeHeroes.");

  while (activeHeroes.length < 20) {
    try {
      const hero = await repository.fetchRandomHero();
      if (hero) {
        addHero(hero);
        logger.info(`Added hero: ${hero.name}`);
      } else {
        logger.warn("No hero fetched. Skipping addition.");
      }
    } catch (error) {
      logger.error("Error fetching random hero:", error);
    }
  }

  const shuffled = [...activeHeroes].sort(() => Math.random() - 0.5);

  todayHeroes.classic = shuffled.slice(0, 1);
  todayHeroes.quotes = shuffled.slice(1, 2);
  todayHeroes.arts = shuffled.slice(2, 3);
  todayHeroes.emojis = shuffled.slice(3, 4);

  logger.info(
    "Today's heroes updated: " +
      Object.keys(todayHeroes)
        .map((mode) => `${mode}: ${todayHeroes[mode].map((h) => h.name)}`)
        .join(", ")
  );

  // Schedule the next update at the next midnight UTC+2
  setTimeout(updateTodayHeroes, timeUntilMidnightUTC2());
}

// Adds a hero while maintaining activeHeroes <= 30
function addHero(hero) {
  if (activeHeroes.some((h) => h.name === hero.name)) {
    logger.warn(`Hero ${hero.name} is already in activeHeroes. Skipping.`);
    return false;
  }

  hero.selectedSplashArtIndex = hero.splashArts
    ? Math.floor(Math.random() * hero.splashArts.length)
    : 0;
  hero.quotes.sort(() => Math.random() - 0.5);
  hero.hints.sort(() => Math.random() - 0.5);

  activeHeroes.push(hero);
  logger.info(`Hero ${hero.name} added to activeHeroes.`);

  while (activeHeroes.length > 30) {
    activeHeroes.shift();
    logger.info("Removed oldest hero from activeHeroes to maintain size <= 30.");
  }

  return true;
}

updateTodayHeroes();

// Start the update process at the next midnight UTC+2
setTimeout(updateTodayHeroes, timeUntilMidnightUTC2());

module.exports = { getTodayHeros };
