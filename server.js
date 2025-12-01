const express = require("express");
const cors = require("cors");
const multer = require("multer");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage: storage });

// Albums Data
let albums = [
  {
    "_id": 1,
    "title": "I Am NOT",
    "albumId": "i-am-not",
    "img_name": "/images/iamNOT2.jpg",
    "releaseDate": "2018-03-16",
    "description": "The debut mini album that introduced Stray Kids to the world with their powerful message of self-identity.",
    "type": "Mini Album",
    "tracks": [
      "District 9",
      "Mirror",
      "Awaken",
      "Rock",
      "Grow Up",
      "Mixtape#1",
      "Mixtape#2",
      "Mixtape#3"
    ]
  },
  {
    "_id": 2,
    "title": "I Am WHO",
    "albumId": "i-am-who",
    "img_name": "/images/IamWHO.jpg",
    "releaseDate": "2018-08-06",
    "description": "Second mini album exploring themes of finding oneself and overcoming obstacles.",
    "type": "Mini Album",
    "tracks": [
      "Voices",
      "My Pace",
      "Insomnia",
      "Hero's Soup",
      "Question",
      "Mixtape#4",
      "Mixtape#5"
    ]
  },
  {
    "_id": 3,
    "title": "I Am YOU",
    "albumId": "i-am-you",
    "img_name": "/images/IamYOU.jpeg",
    "releaseDate": "2018-10-22",
    "description": "Third installment of the I Am series, focusing on relationships and connections.",
    "type": "Mini Album",
    "tracks": [
      "I Am YOU",
      "My Universe",
      "Heroic Soup",
      "Get Cool",
      "Mixtape: On Track"
    ]
  },
  {
    "_id": 4,
    "title": "Cle 1 MIROH",
    "albumId": "cle-1-miroh",
    "img_name": "/images/Miroh.png",
    "releaseDate": "2019-03-25",
    "description": "Beginning of the Clé series with the powerful title track MIROH.",
    "type": "Mini Album",
    "tracks": [
      "MIROH",
      "Victory Song",
      "Maze of Memories",
      "MIROH (Extended Ver.)",
      "Entrance",
      "Chronosaurus"
    ]
  },
  {
    "_id": 5,
    "title": "Go LIVE",
    "albumId": "go-live",
    "img_name": "/images/GoLive.jpg",
    "releaseDate": "2020-06-17",
    "description": "First full-length album featuring the hit title track 'God's Menu'.",
    "type": "Studio Album",
    "tracks": [
      "God's Menu",
      "Easy",
      "Pacemaker",
      "Another Day",
      "Phobia",
      "Blueprint",
      "TA",
      "Haven"
    ]
  },
  {
    "_id": 6,
    "title": "NOEASY",
    "albumId": "noeasy",
    "img_name": "/images/NoEasy.jpeg",
    "releaseDate": "2021-08-23",
    "description": "Second studio album with the explosive title track 'Thunderous'.",
    "type": "Studio Album",
    "tracks": [
      "Cheese",
      "Thunderous",
      "Domino",
      "SSICK",
      "The View",
      "Sorry, I Love You",
      "Silent Cry",
      "Secret Secret"
    ]
  },
  {
    "_id": 7,
    "title": "ODDINARY",
    "albumId": "oddinary",
    "img_name": "/images/Stray_Kids_-_Oddinary.jpeg",
    "releaseDate": "2022-03-18",
    "description": "Embracing being odd and ordinary simultaneously. Features the intense title track 'MANIAC'.",
    "type": "Mini Album",
    "tracks": [
      "VENOM",
      "MANIAC",
      "Charmer",
      "FREEZE",
      "LOL",
      "Muddy Water",
      "Lonely St.",
      "Waiting For Us"
    ]
  },
  {
    "_id": 8,
    "title": "★★★★★ (5-STAR)",
    "albumId": "5-star",
    "img_name": "/images/Stray_Kids_-_5-Star.png",
    "releaseDate": "2023-06-02",
    "description": "Third studio album showcasing peak artistic achievement with 'S-Class' leading the charge.",
    "type": "Studio Album",
    "tracks": [
      "Hall of Fame",
      "S-Class",
      "ITEM",
      "Super Bowl",
      "TOPLINE (Feat. Tiger JK)",
      "DLC",
      "GET LIT",
      "Collision",
      "FNF",
      "Youtiful",
      "THE SOUND",
      "Time Out"
    ]
  },
  {
    "_id": 9,
    "title": "락 (ROCK-STAR)",
    "albumId": "rock-star",
    "img_name": "/images/rockstar.jpg",
    "releaseDate": "2023-11-10",
    "description": "Latest album proving their rock-solid status in the industry with 'LALALALA' as the energetic title track.",
    "type": "Studio Album",
    "tracks": [
      "LALALALA",
      "MEGAVERSE",
      "COMFLEX",
      "COVER ME",
      "Leave",
      "SOCIAL PATH (Feat. LiSA)",
      "Blind Spot",
      "ROCK (락)"
    ]
  }
];

// Validation schema
const albumSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  releaseDate: Joi.string().required(),
  description: Joi.string().min(10).max(500).required(),
  type: Joi.string().valid('Mini Album', 'Studio Album', 'Single', 'EP').required(),
  tracks: Joi.array().items(Joi.string().min(1).max(100)).min(1).required()
});

// GET all albums
app.get("/api/albums/", (req, res) => {
    res.send(albums);
});

// POST new album
app.post("/api/albums", (req, res) => {
  const { error } = albumSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.details[0].message 
    });
  }

  const newId = albums.length > 0 
    ? Math.max(...albums.map(a => a._id)) + 1 
    : 1;

  const albumId = req.body.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const newAlbum = {
    _id: newId,
    title: req.body.title,
    albumId: albumId,
    img_name: "/images/default-album.jpg",
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    type: req.body.type,
    tracks: req.body.tracks
  };

  albums.push(newAlbum);

  res.status(201).json({
    success: true,
    message: "Album added successfully",
    album: newAlbum
  });
});

// PUT - Edit an album
app.put("/api/albums/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const albumIndex = albums.findIndex(a => a._id === id);
    
    if (albumIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Album not found" 
      });
    }

    const { error } = albumSchema.validate(req.body);
    
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

    albums[albumIndex] = {
      ...albums[albumIndex],
      title: req.body.title,
      albumId: albumId,
      releaseDate: req.body.releaseDate,
      description: req.body.description,
      type: req.body.type,
      tracks: req.body.tracks
    };

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      album: albums[albumIndex]
    });
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

// DELETE - Delete an album
app.delete("/api/albums/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const albumIndex = albums.findIndex(a => a._id === id);
    
    if (albumIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Album not found" 
      });
    }

    const deletedAlbum = albums.splice(albumIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
      album: deletedAlbum
    });
  } catch (err) {
    console.error("DELETE Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});