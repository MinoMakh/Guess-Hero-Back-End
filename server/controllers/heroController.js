const logger = require("../utils/logger");
const Hero = require("../models/heroModel.js");
const activeHeroesService = require("../services/activeHeroesService.js");
const heroRepository = require("../repositories/heroRepository.js");

// Get today's hero
exports.getTodayHeros = (req, res) => {
  try {
    const heros = activeHeroesService.getTodayHeros();
    if (heros) {
      res.json(heros);
      logger.info(`Returned today's heroes: ${JSON.stringify(heros)}`);
    } else {
      res.status(404).json({ message: "Heroes not found." });
      logger.warn("Today's heroes not found");
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's hero", error: error.message });
    logger.error(`Error fetching today's hero: ${error.message}`);
  }
};

// Get names of all heroes
exports.getNames = async (req, res) => {
  try {
    const heroes = await heroRepository.fetchHeroesNames();
    res.json(heroes);
    logger.info(`Returned all hero names: ${JSON.stringify(heroes)}`);
  } catch (error) {
    res.status(500).json({ message: "Error fetching heroes' names", error: error });
    logger.error(`Error fetching heroes' names: ${error.message}`);
  }
};

// Get a specific hero by ID
exports.getHeroById = async (req, res) => {
  const { id } = req.params;
  try {
    const hero = await Hero.findById(id);
    if (!hero) {
      res.status(404).json({ message: "Hero not found" });
      logger.warn(`Hero not found with ID: ${id}`);
    } else {
      res.json(hero);
      logger.info(`Returned hero details for ID: ${id}`);
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching hero", error: err });
    logger.error(`Error fetching hero with ID: ${id}: ${err.message}`);
  }
};

// Create a new hero
exports.createHero = async (req, res) => {
  const { name, alias, powers } = req.body;
  try {
    const newHero = new Hero({ name, alias, powers });
    await newHero.save();
    res.status(201).json(newHero);
    logger.info(`Created new hero: ${name} (${alias})`);
  } catch (err) {
    res.status(400).json({ message: "Error creating hero", error: err });
    logger.error(`Error creating hero: ${err.message}`);
  }
};

// Update a hero's details
exports.updateHero = async (req, res) => {
  const { id } = req.params;
  const { name, alias, powers } = req.body;
  try {
    const updatedHero = await Hero.findByIdAndUpdate(
      id,
      { name, alias, powers },
      { new: true }
    );
    if (!updatedHero) {
      res.status(404).json({ message: "Hero not found" });
      logger.warn(`Hero not found for update with ID: ${id}`);
    } else {
      res.json(updatedHero);
      logger.info(`Updated hero with ID: ${id}`);
    }
  } catch (err) {
    res.status(400).json({ message: "Error updating hero", error: err });
    logger.error(`Error updating hero with ID: ${id}: ${err.message}`);
  }
};

// Delete a hero
exports.deleteHero = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHero = await Hero.findByIdAndDelete(id);
    if (!deletedHero) {
      res.status(404).json({ message: "Hero not found" });
      logger.warn(`Hero not found for deletion with ID: ${id}`);
    } else {
      res.json({ message: "Hero deleted successfully" });
      logger.info(`Deleted hero with ID: ${id}`);
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting hero", error: err });
    logger.error(`Error deleting hero with ID: ${id}: ${err.message}`);
  }
};
