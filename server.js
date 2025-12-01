require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const Joi = require("joi");
const Album = require("./models/Album");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Validation schema
const albumSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  releaseDate: Joi.string().required(),
  description: Joi.string().min(10).max(500).required(),
  type: Joi.string().valid('Mini Album', 'Studio Album', 'Single', 'EP').required(),
  tracks: Joi.array().items(Joi.string().min(1).max(100)).min(1).required()
});

// GET all albums
app.get("/api/albums", async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching albums' 
    });
  }
});

// POST new album (with image upload)
app.post("/api/albums", upload.single("img"), async (req, res) => {
  try {
    const { error } = albumSchema.validate({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      type: req.body.type,
      tracks: JSON.parse(req.body.tracks)
    });

    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const albumId = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const newAlbum = new Album({
      title: req.body.title,
      albumId: albumId,
      img_name: req.file ? `/images/${req.file.filename}` : '/images/default-album.jpg',
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      type: req.body.type,
      tracks: JSON.parse(req.body.tracks)
    });

    await newAlbum.save();

    res.status(201).json({
      success: true,
      message: "Album added successfully",
      album: newAlbum
    });
  } catch (error) {
    console.error('Error adding album:', error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// PUT - Edit an album (with image upload)
app.put("/api/albums/:id", upload.single("img"), async (req, res) => {
  try {
    const { error } = albumSchema.validate({
      title: req.body.title,
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      type: req.body.type,
      tracks: JSON.parse(req.body.tracks)
    });

    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const albumId = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const updateData = {
      title: req.body.title,
      albumId: albumId,
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      type: req.body.type,
      tracks: JSON.parse(req.body.tracks)
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      updateData.img_name = `/images/${req.file.filename}`;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ 
        success: false, 
        message: "Album not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      album: updatedAlbum
    });
  } catch (error) {
    console.error("PUT Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

// DELETE - Delete an album
app.delete("/api/albums/:id", async (req, res) => {
  try {
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);

    if (!deletedAlbum) {
      return res.status(404).json({ 
        success: false, 
        message: "Album not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
      album: deletedAlbum
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});