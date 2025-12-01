require('dotenv').config();
const mongoose = require('mongoose');
const Album = require('./models/Album');

const albums = [
  {
    title: "I Am NOT",
    albumId: "i-am-not",
    img_name: "/images/iamNOT2.jpg",
    releaseDate: "2018-03-16",
    description: "The debut mini album that introduced Stray Kids to the world with their powerful message of self-identity.",
    type: "Mini Album",
    tracks: [
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
    title: "I Am WHO",
    albumId: "i-am-who",
    img_name: "/images/IamWHO.jpg",
    releaseDate: "2018-08-06",
    description: "Second mini album exploring themes of finding oneself and overcoming obstacles.",
    type: "Mini Album",
    tracks: [
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
    title: "I Am YOU",
    albumId: "i-am-you",
    img_name: "/images/IamYOU.jpeg",
    releaseDate: "2018-10-22",
    description: "Third installment of the I Am series, focusing on relationships and connections.",
    type: "Mini Album",
    tracks: [
      "I Am YOU",
      "My Universe",
      "Heroic Soup",
      "Get Cool",
      "Mixtape: On Track"
    ]
  },
  {
    title: "Cle 1 MIROH",
    albumId: "cle-1-miroh",
    img_name: "/images/Miroh.png",
    releaseDate: "2019-03-25",
    description: "Beginning of the Clé series with the powerful title track MIROH.",
    type: "Mini Album",
    tracks: [
      "MIROH",
      "Victory Song",
      "Maze of Memories",
      "MIROH (Extended Ver.)",
      "Entrance",
      "Chronosaurus"
    ]
  },
  {
    title: "Go LIVE",
    albumId: "go-live",
    img_name: "/images/GoLive.jpg",
    releaseDate: "2020-06-17",
    description: "First full-length album featuring the hit title track 'God's Menu'.",
    type: "Studio Album",
    tracks: [
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
    title: "NOEASY",
    albumId: "noeasy",
    img_name: "/images/NoEasy.jpeg",
    releaseDate: "2021-08-23",
    description: "Second studio album with the explosive title track 'Thunderous'.",
    type: "Studio Album",
    tracks: [
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
    title: "ODDINARY",
    albumId: "oddinary",
    img_name: "/images/Stray_Kids_-_Oddinary.jpeg",
    releaseDate: "2022-03-18",
    description: "Embracing being odd and ordinary simultaneously. Features the intense title track 'MANIAC'.",
    type: "Mini Album",
    tracks: [
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
    title: "★★★★★ (5-STAR)",
    albumId: "5-star",
    img_name: "/images/Stray_Kids_-_5-Star.png",
    releaseDate: "2023-06-02",
    description: "Third studio album showcasing peak artistic achievement with 'S-Class' leading the charge.",
    type: "Studio Album",
    tracks: [
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
    title: "락 (ROCK-STAR)",
    albumId: "rock-star",
    img_name: "/images/rockstar.jpg",
    releaseDate: "2023-11-10",
    description: "Latest album proving their rock-solid status in the industry with 'LALALALA' as the energetic title track.",
    type: "Studio Album",
    tracks: [
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

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Album.deleteMany({});
    console.log('Cleared existing albums');

    // Insert new data
    await Album.insertMany(albums);
    console.log('Seeded database with', albums.length, 'albums');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();