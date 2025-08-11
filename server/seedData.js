import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.model.js';
import Channel from './models/Channel.model.js';
import Video from './models/Video.model.js';
import Comment from './models/Comment.model.js';

// Load environment variables
dotenv.config();

// Sample user data
const users = [
  {
    username: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'Test@123',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    username: 'Sarah Williams',
    email: 'sarah@example.com',
    password: 'Test@123',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    username: 'Mike Chen',
    email: 'mike@example.com',
    password: 'Test@123',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    username: 'Emma Davis',
    email: 'emma@example.com',
    password: 'Test@123',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    username: 'David Kim',
    email: 'david@example.com',
    password: 'Test@123',
    avatar: 'https://randomuser.me/api/portraits/men/91.jpg'
  }
];

// Sample channel data
const channels = [
  {
    channelName: 'Tech Explorers',
    description: 'Exploring the latest in technology, gadgets, and software development.',
    isVerified: true,
    channelBanner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&h=150&fit=crop&crop=face'
  },
  {
    channelName: 'Cooking with Sarah',
    description: 'Delicious recipes and cooking tutorials for home chefs of all levels.',
    isVerified: true,
    channelBanner: 'https://images.unsplash.com/photo-1504674900247-087703934569?w=1920&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    channelName: 'Gaming Universe',
    description: 'Latest game reviews, walkthroughs, and gaming news.',
    isVerified: false,
    channelBanner: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1920&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
  },
  {
    channelName: 'Travel Diaries',
    description: 'Exploring beautiful destinations around the world, one adventure at a time.',
    isVerified: true,
    channelBanner: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    channelName: 'Fitness Journey',
    description: 'Workout routines, nutrition tips, and fitness motivation.',
    isVerified: false,
    channelBanner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=400&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  }
];

// Sample video data
const videos = [
  {
    title: 'Building a Full-Stack MERN Application',
    description: 'In this tutorial, we\'ll build a complete MERN stack application from scratch, covering both frontend and backend development.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
    videoUrl: 'https://example.com/videos/mern-tutorial.mp4',
    duration: 1256,
    views: 12500,
    category: 'Technology',
    tags: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Tutorial']
  },
  {
    title: '5 Easy Dinner Recipes for Busy Weeknights',
    description: 'Quick and delicious dinner recipes that you can make in under 30 minutes! Perfect for busy weeknights.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=1280&h=720&fit=crop',
    videoUrl: 'https://example.com/videos/dinner-recipes.mp4',
    duration: 842,
    views: 34200,
    category: 'Food',
    tags: ['cooking', 'recipes', 'dinner', 'quick meals', 'food']
  },
  {
    title: 'Elden Ring - Full Game Walkthrough Part 1',
    description: 'Join me as I start my journey through the Lands Between in Elden Ring. This is part 1 of my complete walkthrough series.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1643629094403-19d8f9eafbbe?w=1280&h=720&fit=crop',
    videoUrl: 'https://example.com/videos/elden-ring-walkthrough.mp4',
    duration: 2345,
    views: 89200,
    category: 'Gaming',
    tags: ['Elden Ring', 'Walkthrough', 'Gameplay', 'Soulslike', 'RPG']
  },
  {
    title: 'Bali Travel Guide: Top 10 Things to Do',
    description: 'Discover the best places to visit in Bali, Indonesia. From beautiful beaches to cultural landmarks, this guide covers it all!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1280&h=720&fit=crop',
    videoUrl: 'https://example.com/videos/bali-travel-guide.mp4',
    duration: 1123,
    views: 56700,
    category: 'Travel',
    tags: ['Bali', 'Travel', 'Indonesia', 'Tourism', 'Travel Guide']
  },
  {
    title: 'Full Body Home Workout (No Equipment Needed)',
    description: 'Get a complete full body workout at home with no equipment needed. Perfect for beginners and all fitness levels!',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop',
    videoUrl: 'https://example.com/videos/home-workout.mp4',
    duration: 1560,
    views: 78300,
    category: 'Health',
    tags: ['workout', 'fitness', 'home workout', 'no equipment', 'exercise']
  }
];

// Sample comments
const comments = [
  "Great tutorial! Really helped me understand the MERN stack better.",
  "The recipes look delicious! Can't wait to try them out this weekend.",
  "Amazing gameplay! The boss fight at 12:30 was insane!",
  "Bali is on my bucket list! Thanks for the great recommendations.",
  "This workout kicked my butt! But I feel amazing afterward.",
  "Clear explanations and well-structured code. Subscribed!",
  "I made the pasta recipe for dinner and it was a hit with my family!",
  "The graphics in this game are absolutely stunning.",
  "I've been to Bali twice and you've captured the best spots perfectly!",
  "Love that these workouts can be done anywhere. Perfect for travel!"
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log('Seeded users');
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed channels
const seedChannels = async (users) => {
  try {
    const createdChannels = [];
    for (let i = 0; i < channels.length; i++) {
      const channelData = channels[i];
      const owner = users[i % users.length]._id; // Distribute channels among users
      
      const channel = new Channel({
        ...channelData,
        owner,
        subscribers: Math.floor(Math.random() * 10000) + 1000, // Random subscriber count
        totalViews: Math.floor(Math.random() * 500000) + 10000 // Random view count
      });
      
      const savedChannel = await channel.save();
      createdChannels.push(savedChannel);
      
      // Add channel reference to user
      await User.findByIdAndUpdate(owner, {
        $push: { channels: savedChannel._id }
      });
    }
    console.log('Seeded channels');
    return createdChannels;
  } catch (error) {
    console.error('Error seeding channels:', error);
    throw error;
  }
};

// Seed videos
const seedVideos = async (channels, users) => {
  try {
    const createdVideos = [];
    for (let i = 0; i < videos.length; i++) {
      const videoData = videos[i];
      const channel = channels[i % channels.length];
      
      const video = new Video({
        ...videoData,
        channelId: channel._id,
        owner: channel.owner,
        likes: Math.floor(Math.random() * 1000) + 50,
        dislikes: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 100) + 5,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)) // Random date in last 30 days
      });
      
      const savedVideo = await video.save();
      createdVideos.push(savedVideo);
      
      // Add video reference to channel
      await Channel.findByIdAndUpdate(channel._id, {
        $push: { videos: savedVideo._id },
        $inc: { totalViews: savedVideo.views }
      });
    }
    console.log('Seeded videos');
    return createdVideos;
  } catch (error) {
    console.error('Error seeding videos:', error);
    throw error;
  }
};

// Seed comments
const seedComments = async (videos, users) => {
  try {
    const createdComments = [];
    
    // Create multiple comments per video
    for (const video of videos) {
      const commentsCount = Math.floor(Math.random() * 5) + 2; // 2-6 comments per video
      
      for (let i = 0; i < commentsCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        
        const comment = new Comment({
          videoId: video._id,
          userId: randomUser._id,
          text: randomComment,
          likes: Math.floor(Math.random() * 100),
          dislikes: Math.floor(Math.random() * 10),
          isEdited: Math.random() > 0.8, // 20% chance of being edited
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)) // Random date in last 7 days
        });
        
        const savedComment = await comment.save();
        createdComments.push(savedComment);
        
        // Add comment reference to video
        await Video.findByIdAndUpdate(video._id, {
          $push: { comments: savedComment._id }
        });
      }
    }
    
    console.log('Seeded comments');
    return createdComments;
  } catch (error) {
    console.error('Error seeding comments:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearData();
    
    console.log('Starting to seed database...');
    
    const users = await seedUsers();
    const channels = await seedChannels(users);
    const videos = await seedVideos(channels, users);
    await seedComments(videos, users);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
if (process.argv[2] === '--import') {
  seedDatabase();
} else {
  console.log('To seed the database, run: node seedData.js --import');
}
