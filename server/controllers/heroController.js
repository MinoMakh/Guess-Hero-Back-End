const Hero = require("../models/heroModel.js");
const activeHeroesService = require("../services/activeHeroesService.js");
const heroRepository = require("../repositories/heroRepository.js");

// Get today's hero
exports.getTodayHeros = (req, res) => {
  try {
    const heros = activeHeroesService.getTodayHeros();
    if (heros) {
      res.json(heros);
      console.log(`Returned today's heros: ${heros}`);
    } else {
      res.status(404).json({ message: "Heros not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's hero:", error: error.message });
  }
};


// Get names of all heroes
exports.getNames = async (req, res) => {
  try {
    const heroes = await heroRepository.fetchHeroesNames();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching heroes nawmes:", error: error });
  }
};

// Get a specific hero by ID
exports.getHeroById = async (req, res) => {
  const { id } = req.params; // Extract hero ID from the URL parameter
  try {
    const hero = await Hero.findById(id); // Find the hero by ID
    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }
    res.json(hero); // Send the hero details as a JSON response
  } catch (err) {
    res.status(500).json({ message: "Error fetching hero", error: err });
  }
};

// Create a new hero
exports.createHero = async (req, res) => {
  const { name, alias, powers } = req.body; // Extract data from the request body
  try {
    const newHero = new Hero({ name, alias, powers });
    await newHero.save(); // Save the new hero to the database
    res.status(201).json(newHero); // Respond with the created hero
  } catch (err) {
    res.status(400).json({ message: "Error creating hero", error: err });
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
      { new: true } // Return the updated hero
    );
    if (!updatedHero) {
      return res.status(404).json({ message: "Hero not found" });
    }
    res.json(updatedHero);
  } catch (err) {
    res.status(400).json({ message: "Error updating hero", error: err });
  }
};

// Delete a hero
exports.deleteHero = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHero = await Hero.findByIdAndDelete(id);
    if (!deletedHero) {
      return res.status(404).json({ message: "Hero not found" });
    }
    res.json({ message: "Hero deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting hero", error: err });
  }
};
