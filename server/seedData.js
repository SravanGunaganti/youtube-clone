import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.model.js";
import Channel from "./models/Channel.model.js";
import Video from "./models/Video.model.js";
import Comment from "./models/Comment.model.js";
dotenv.config();

// 20 Categories
const categories = [
  "Technology",
  "Food",
  "Gaming",
  "Music",
  "Sports",
  "Education",
  "Travel",
  "Movies",
  "Animals",
  "News",
  "Fashion",
  "Health",
  "Finance",
  "Photography",
  "Art",
  "Science",
  "Automotive",
  "Fitness",
  "DIY",
  "Comedy",
];

// Video URLs (40 total for 2 per category)
const videoUrls = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://archive.org/download/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4",
  "https://archive.org/download/SampleVideo1280x7201mb/SampleVideo_1280x720_1mb.mp4",
  "https://archive.org/download/SampleVideo1280x7202mb/SampleVideo_1280x720_2mb.mp4",
  "https://archive.org/download/SampleVideo640x3601mb/SampleVideo_640x360_1mb.mp4",
  "https://archive.org/download/SampleVideo640x3602mb/SampleVideo_640x360_2mb.mp4",
  "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
  "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4",
  "https://file-examples.com/storage/fe68c0b5c98cb59f0b33d41/2017/10/file_example_MP4_1280_10MG.mp4",
  "https://file-examples.com/storage/fe68c0b5c98cb59f0b33d41/2017/10/file_example_MP4_1920_18MG.mp4",
  "https://file-examples.com/storage/fe68c0b5c98cb59f0b33d41/2017/10/file_example_MP4_640_3MG.mp4",
  "https://file-examples.com/storage/fe68c0b5c98cb59f0b33d41/2017/10/file_example_MP4_480_1_5MG.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_1280x720_1mb.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_1280x720_2mb.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_640x360_1mb.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_640x360_2mb.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_1920x1080_1mb.mp4",
  "https://filesamples.com/samples/video/mp4/SampleVideo_1920x1080_2mb.mp4",
];

// Quick thumbnail URLs (2 per category)
const getThumbnails = (category) => {
  const baseUrl = "https://images.unsplash.com/photo-";
  const thumbnailMap = {
    technology: ["1627398242454-45a1465c2479", "1633356122544-f134324a6cee"],
    food: ["1551892374-ecf8754cf8b0", "1546793665-c74683f339c1"],
    gaming: ["1556438064-2d7646166914", "1493711662062-fa541adb3fc8"],
    music: ["1511379938547-c1f69419868d", "1487180144351-b8472da7d491"],
    sports: ["1541534741688-6078c6bfb5c5", "1449824913935-59a10b8d2000"],
    education: ["1523240795612-9a054b0db644", "1503676260728-1c00da094a0b"],
    travel: ["1469474968028-56623f02e42e", "1476514525535-07fb3b4ae5f1"],
    movies: ["1542204165-65bf26472b9b", "1594909122845-11baa439b7bf"],
    animals: ["1441974231531-c6227db76b6e", "1546026423-cc4642628d2b"],
    news: ["1495020689067-958852a7765e", "1611273426858-450d8e3c9fce"],
    fashion: ["1445205170230-053b83016050", "1529139574466-a303027c1d8b"],
    health: ["1559757148-5c350d0d3c56", "1505751172876-fa1923c5c528"],
    finance: ["1554224155-6726b3ff858f", "1579621970563-ebec7560ff3e"],
    photography: ["1452587925148-ce544e77e70d", "1554048612-b6a482b224a1"],
    art: ["1541961017774-22349e4a1262", "1578662996442-48f60103fc96"],
    science: ["1532094349884-543bc11b234d", "1507003211169-0a1dd7228f2d"],
    automotive: ["1549317661-bd32c8ce0db2", "1485291571150-772bcfc10da5"],
    fitness: ["1534438327276-14e5300c3a48", "1593079831268-3381b0db4a77"],
    diy: ["1416879595882-3373a0480b5b", "1581833971358-2c8b550f87b3"],
    comedy: ["1595152772835-219674b2a8a6", "1544716278-ca5e3f4abd8c"],
  };

  const ids = thumbnailMap[category.toLowerCase()] || thumbnailMap.technology;
  return ids.map((id) => `${baseUrl}${id}?w=1280&h=720&fit=crop&crop=center`);
};

// Channel and video data (1 channel per category, 2 videos per channel)
const getChannelData = (category) => {
  const channelMap = {
    Technology: {
      name: "TechReview Pro",
      description: "Latest tech reviews and programming tutorials",
      videos: [
        {
          title: "JavaScript ES2024 New Features",
          description: "Latest JavaScript features and syntax improvements",
        },
        {
          title: "React 18 Performance Guide",
          description: "Optimize React apps with new concurrent features",
        },
      ],
    },
    Food: {
      name: "Kitchen Masters",
      description: "Professional cooking techniques and recipes",
      videos: [
        {
          title: "Perfect Pasta Carbonara",
          description: "Authentic Italian carbonara recipe and technique",
        },
        {
          title: "Thai Street Food Secrets",
          description: "Authentic Thai cooking methods and flavors",
        },
      ],
    },
    Gaming: {
      name: "Pro Gaming Hub",
      description: "Gaming strategies and reviews",
      videos: [
        {
          title: "Valorant Pro Aiming Guide",
          description: "Professional aiming techniques and crosshair placement",
        },
        {
          title: "Elden Ring Boss Strategies",
          description: "Complete boss fight guide with tips and tricks",
        },
      ],
    },
    Music: {
      name: "Studio Pro",
      description: "Music production and audio engineering",
      videos: [
        {
          title: "FL Studio Beat Making",
          description: "Hip-hop beat production tutorial from scratch",
        },
        {
          title: "Vocal Recording Tips",
          description: "Professional vocal recording at home setup",
        },
      ],
    },
    Sports: {
      name: "Athletic Performance",
      description: "Sports training and performance tips",
      videos: [
        {
          title: "Olympic Weightlifting Form",
          description: "Proper technique for clean and jerk",
        },
        {
          title: "Running Biomechanics",
          description: "Efficient running form and injury prevention",
        },
      ],
    },
    Education: {
      name: "Learning Academy",
      description: "Educational content and study techniques",
      videos: [
        {
          title: "Calculus Made Simple",
          description: "Understanding derivatives and integration",
        },
        {
          title: "Study Techniques That Work",
          description: "Science-based learning and memory methods",
        },
      ],
    },
    Travel: {
      name: "Wanderlust Guide",
      description: "Travel tips and destination guides",
      videos: [
        {
          title: "Southeast Asia Backpacking",
          description: "Complete budget travel guide and itinerary",
        },
        {
          title: "Solo Travel Safety Tips",
          description: "Essential safety strategies for independent travelers",
        },
      ],
    },
    Movies: {
      name: "Cinema Analysis",
      description: "Film reviews and movie industry insights",
      videos: [
        {
          title: "Christopher Nolan Cinematography",
          description: "Analysis of visual storytelling techniques",
        },
        {
          title: "Indie Film Festival Review",
          description: "Best independent films and emerging directors",
        },
      ],
    },
    Animals: {
      name: "Wildlife Explorer",
      description: "Animal documentaries and pet care",
      videos: [
        {
          title: "African Safari Wildlife",
          description: "Big Five animal behavior and conservation",
        },
        {
          title: "Dog Training Fundamentals",
          description: "Positive reinforcement training methods",
        },
      ],
    },
    News: {
      name: "Global Updates",
      description: "Current events and news analysis",
      videos: [
        {
          title: "2024 Economic Outlook",
          description: "Global market trends and financial predictions",
        },
        {
          title: "Climate Policy Updates",
          description: "International environmental agreements progress",
        },
      ],
    },
    Fashion: {
      name: "Style Evolution",
      description: "Fashion trends and styling guides",
      videos: [
        {
          title: "Sustainable Fashion Guide",
          description: "Ethical shopping and wardrobe building tips",
        },
        {
          title: "Personal Style Development",
          description: "Finding your signature look and style identity",
        },
      ],
    },
    Health: {
      name: "Wellness Science",
      description: "Health and wellness education",
      videos: [
        {
          title: "Nutrition Science Basics",
          description: "Evidence-based nutrition and metabolic health",
        },
        {
          title: "Mental Health Strategies",
          description: "Stress management and resilience building",
        },
      ],
    },
    Finance: {
      name: "Investment Guide",
      description: "Financial education and investment strategies",
      videos: [
        {
          title: "Stock Market Fundamentals",
          description: "Value investing and portfolio management",
        },
        {
          title: "Personal Finance Planning",
          description: "Budgeting and wealth building strategies",
        },
      ],
    },
    Photography: {
      name: "Photo Masterclass",
      description: "Photography techniques and gear reviews",
      videos: [
        {
          title: "Portrait Lighting Mastery",
          description: "Studio and natural light techniques",
        },
        {
          title: "Landscape Composition",
          description: "Advanced composition and golden hour photography",
        },
      ],
    },
    Art: {
      name: "Digital Art Studio",
      description: "Digital and traditional art tutorials",
      videos: [
        {
          title: "Digital Painting Techniques",
          description: "Photoshop brush techniques and digital art",
        },
        {
          title: "Character Design Process",
          description: "From concept to final illustration workflow",
        },
      ],
    },
    Science: {
      name: "Space Lab",
      description: "Science education and space exploration",
      videos: [
        {
          title: "James Webb Telescope Discoveries",
          description: "Latest space discoveries and cosmic phenomena",
        },
        {
          title: "CRISPR Gene Editing Explained",
          description: "Molecular mechanisms and ethical implications",
        },
      ],
    },
    Automotive: {
      name: "Car Tech Review",
      description: "Automotive reviews and car technology",
      videos: [
        {
          title: "Electric Vehicle Technology",
          description: "EV battery performance and charging infrastructure",
        },
        {
          title: "Classic Car Restoration",
          description: "Vintage automobile restoration techniques",
        },
      ],
    },
    Fitness: {
      name: "Strength Lab",
      description: "Fitness training and exercise science",
      videos: [
        {
          title: "Progressive Overload Training",
          description: "Scientific muscle building and strength gains",
        },
        {
          title: "Functional Movement Patterns",
          description: "Movement quality and injury prevention",
        },
      ],
    },
    DIY: {
      name: "Workshop Pro",
      description: "DIY projects and home improvement",
      videos: [
        {
          title: "Woodworking Joint Techniques",
          description: "Traditional joinery and furniture making",
        },
        {
          title: "Arduino Electronics Projects",
          description: "Programming and circuit design basics",
        },
      ],
    },
    Comedy: {
      name: "Comedy Central Hub",
      description: "Stand-up comedy and humor education",
      videos: [
        {
          title: "Joke Writing Techniques",
          description: "Setup, punchline, and timing mastery",
        },
        {
          title: "Stand-Up Stage Presence",
          description: "Confidence and audience connection skills",
        },
      ],
    },
  };
  return channelMap[category] || channelMap.Technology;
};

// Comment templates by category
const getComments = (category) => {
  const commentMap = {
    Technology: [
      "This tutorial is amazing!",
      "Great code examples!",
      "Very helpful explanation!",
    ],
    Food: [
      "Made this recipe - delicious!",
      "Great cooking technique!",
      "Love this dish!",
    ],
    Gaming: [
      "This strategy works perfectly!",
      "Great gameplay tips!",
      "Finally beat this level!",
    ],
    Music: [
      "Amazing production quality!",
      "Love this beat!",
      "Great music theory!",
    ],
    Sports: [
      "Excellent training advice!",
      "This workout is intense!",
      "Great form demonstration!",
    ],
    Education: [
      "Finally understand this topic!",
      "Great teaching method!",
      "Very clear explanation!",
    ],
    Travel: [
      "Adding this to my bucket list!",
      "Great travel tips!",
      "Beautiful destination!",
    ],
    Movies: [
      "Love your film analysis!",
      "Great movie recommendation!",
      "Interesting perspective!",
    ],
    Animals: [
      "Such beautiful wildlife!",
      "Great pet care advice!",
      "Amazing animal behavior!",
    ],
    News: [
      "Thanks for unbiased reporting!",
      "Important story coverage!",
      "Well researched article!",
    ],
    Fashion: [
      "Love this style guide!",
      "Great fashion advice!",
      "Perfect outfit inspiration!",
    ],
    Health: [
      "Very helpful health tips!",
      "Science-based information!",
      "Great wellness advice!",
    ],
    Finance: [
      "Excellent investment advice!",
      "Clear financial explanation!",
      "Very helpful tips!",
    ],
    Photography: [
      "Amazing photo techniques!",
      "Great gear review!",
      "Beautiful composition!",
    ],
    Art: [
      "Incredible art tutorial!",
      "Love your technique!",
      "Very inspiring artwork!",
    ],
    Science: [
      "Fascinating scientific content!",
      "Great research explanation!",
      "Mind-blowing discoveries!",
    ],
    Automotive: [
      "Excellent car review!",
      "Great technical analysis!",
      "Very helpful guide!",
    ],
    Fitness: [
      "Effective workout routine!",
      "Great form tips!",
      "Excellent training advice!",
    ],
    DIY: [
      "This project turned out great!",
      "Clear instructions!",
      "Very helpful tutorial!",
    ],
    Comedy: [
      "Hilarious content!",
      "Great comedy tips!",
      "Made me laugh so hard!",
    ],
  };
  return commentMap[category] || commentMap.Technology;
};

// Random utility functions
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate users (20 users for 20 channels)
const generateUsers = () => {
  const names = [
    "Alex Johnson",
    "Sarah Wilson",
    "Mike Davis",
    "Emily Brown",
    "David Garcia",
    "Jessica Miller",
    "Chris Anderson",
    "Amanda Taylor",
    "Matt Thompson",
    "Lisa White",
    "Ryan Harris",
    "Jennifer Clark",
    "Kevin Lewis",
    "Michelle Young",
    "Brian Hall",
    "Nicole Allen",
    "Jason King",
    "Ashley Wright",
    "Brandon Lopez",
    "Stephanie Hill",
  ];

  return names.map((name, i) => ({
    username: name,
    email: name.replace(" ", "").toLowerCase() + "@gmail.com",
    password: "Password@2025",
    avatar: `https://i.pravatar.cc/300?img=${i + 1}`,
  }));
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    console.log("Creating users...");
    const userData = generateUsers();
    const users = await User.create(userData);
    console.log(`Created ${users.length} demo users`);

    // Create channels and videos
    console.log("Creating channels, videos and comments...");
    let totalVideos = 0;
    let totalComments = 0;
    let videoUrlIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const channelData = getChannelData(category);
      const thumbnails = getThumbnails(category);
      const user = users[i];

      // Create channel
      const channel = await Channel.create({
        channelName: channelData.name,
        owner: user._id,
        description: channelData.description,
        channelBanner: `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1280&h=300&fit=crop&crop=center&sig=${i}`,
        subscribers: randomInRange(5000, 100000),
        totalViews: 0,
        isVerified: Math.random() > 0.5,
        avatar: `https://i.pravatar.cc/300?img=${i + 21}`,
        category: category,
        videos: [],
      });

      // Create 2 videos per channel
      const videoIds = [];
      for (let j = 0; j < 2; j++) {
        if (videoUrlIndex < videoUrls.length && j < channelData.videos.length) {
          const videoInfo = channelData.videos[j];

          const video = await Video.create({
            title: videoInfo.title,
            thumbnailUrl: thumbnails[j],
            videoUrl: videoUrls[videoUrlIndex],
            description: videoInfo.description,
            channelId: channel._id,
            uploader: user._id,
            views: randomInRange(1000, 50000),
            likes: randomInRange(50, 2000),
            dislikes: randomInRange(2, 50),
            category: category,
            duration: randomInRange(300, 1800),
            uploadDate: new Date(
              Date.now() - randomInRange(1, 90) * 24 * 60 * 60 * 1000
            ),
          });

          videoIds.push(video._id);
          totalVideos++;
          videoUrlIndex++;

          // Create 3-5 comments per video
          const commentTemplates = getComments(category);
          const commentCount = randomInRange(3, 5);

          for (let k = 0; k < commentCount; k++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            await Comment.create({
              userId: randomUser._id,
              videoId: video._id,
              text: commentTemplates[k % commentTemplates.length],
              timestamp: new Date(
                Date.now() - randomInRange(1, 7) * 24 * 60 * 60 * 1000
              ),
              likes: randomInRange(0, 25),
              dislikes: randomInRange(0, 3),
            });
            totalComments++;
          }
        }
      }

      // Update channel with video references and total views
      const channelTotalViews = await Video.aggregate([
        { $match: { channelId: channel._id } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
      ]);

      await Channel.updateOne(
        { _id: channel._id },
        {
          $set: {
            videos: videoIds,
            totalViews: channelTotalViews[0]?.totalViews || 0,
            videoCount: videoIds.length,
          },
        }
      );

      console.log(
        `✅ ${category}: Channel + ${videoIds.length} videos + comments`
      );
    }

    console.log("\n=== VIDEO PLATFORM DATA CREATED SUCCESSFULLY ===");
    console.log(`📊 Final Statistics:`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`📺 Channels: ${categories.length}`);
    console.log(`🎥 Videos: ${totalVideos}`);
    console.log(`💬 Comments: ${totalComments}`);

    console.log(`\n📈 Category Breakdown:`);
    categories.forEach((category) => {
      console.log(`${category}: 1 channel, 2 videos`);
    });

    console.log(`\n🔐 Login Credentials:`);
    console.log(`Password for all users: "Password@2025"`);
    console.log(
      `Sample emails: ${users
        .slice(0, 3)
        .map((u) => u.email)
        .join(", ")}...`
    );

    console.log(`\n🚀 Production-ready with ${categories.length} categories!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
