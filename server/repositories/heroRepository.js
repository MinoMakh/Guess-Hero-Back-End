const { MongoClient, ServerApiVersion } = require("mongodb");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const logger = require("../utils/logger");

// Connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function fetchRandomHero() {
  try {
    // Database connection
    await client.connect();
    const db = client.db("guessTheHero");
    const collection = db.collection("heroes");

    // Get a random hero record
    const randomHero = await collection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    logger.info("Fetched random hero successfully");
    return randomHero[0];
  } catch (error) {
    logger.error("An error occurred while fetching random hero.", error);
    throw new Error("Error fetching random hero.");
  }
}

async function fetchHeroesNames() {
  try {
    // Database connection
    await client.connect();
    const db = client.db("guessTheHero");
    const collection = db.collection("heroes");

    // Fetch hero names
    const heroNames = await collection
      .find({}, { projection: { name: 1, image: 1, _id: 0 } })
      .toArray();

    logger.info(`Fetched ${heroNames.length} hero names successfully.`);
    return heroNames.map((hero) => ({
      name: hero.name,
      image: hero.image,
    }));
  } catch (error) {
    logger.error("An error occurred while fetching heroes names.", error);
    throw new Error("Error fetching heroes names.");
  }
}

async function addHeroes(heroes) {
  try {
    // Database connection
    await client.connect();
    const db = client.db("guessTheHero");
    const collection = db.collection("heroes");

    // Process each hero for Base64 conversion (if needed)
    const processedHeroes = heroes.map((hero) => {
      // Convert hero image to Base64 if an imagePath is provided
      let imageBase64 = null;
      if (hero.image) {
        imageBase64 = fs.readFileSync(path.join(__dirname, hero.image), {
          encoding: "base64",
        });
      }

      // Convert splashArts to Base64 if splashArt paths are provided
      const splashArtsBase64 = hero.splashArts
        ? hero.splashArts.map((splashArt) =>
            fs.readFileSync(path.join(__dirname, splashArt), {
              encoding: "base64",
            })
          )
        : [];

      return { ...hero, image: imageBase64, splashArts: splashArtsBase64 };
    });

    // Insert processed heroes into the database
    const result = await collection.insertMany(processedHeroes);
    logger.info(`Inserted ${result.insertedCount} heroes successfully.`);
  } catch (error) {
    logger.error("An error occurred while adding heroes:", error);
    throw new Error("Error adding heroes.");
  } finally {
    await client.close();
  }
}

async function removeDB() {
  try {
    // Database connection
    await client.connect();
    const db = client.db("guessTheHero");
    const collection = db.collection("heroes");

    // Remove all documents from the collection
    const result = await collection.deleteMany({});
    logger.info(`Removed ${result.deletedCount} heroes from the database.`);
  } catch (error) {
    logger.error(
      "An error occurred while removing the database entries:",
      error
    );
    throw new Error("Error removing heroes.");
  } finally {
    await client.close();
  }
}

module.exports = { fetchRandomHero, fetchHeroesNames, addHeroes, removeDB };
