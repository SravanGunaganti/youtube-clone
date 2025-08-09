import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Channel from '../models/Channel.model.js';
import Video from '../models/Video.model.js';
import Comment from '../models/Comment.model.js';
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    // await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    // const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        username: 'TechGuru',
        email: 'techguru@example.com',
        password: "Techguru@2025"
      },
      {
        username: 'CookingMaster',
        email: 'cooking@example.com',
        password: "CookingMaster@2025"
      },
      {
        username: 'FitnessCoach',
        email: 'fitness@example.com',
        password: "FitnessCoach@2025"
      },
      {
        username: 'MusicProducer',
        email: 'music@example.com',
        password: "MusicProducer@2025"
      }
    ]);

    console.log('Created demo users');

    // Create demo channels
    const channels = await Channel.create([
      {
        channelName: 'Tech Tutorials Hub',
        owner: users[0]._id,
        description: 'Learn programming, web development, and the latest tech trends. Subscribe for weekly tutorials!',
        channelBanner: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1280&h=300&fit=crop',
        subscribers: 15420
      },
      {
        channelName: 'Delicious Kitchen',
        owner: users[1]._id,
        description: 'Easy and delicious recipes for everyone. From quick meals to gourmet dishes!',
        channelBanner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&h=300&fit=crop',
        subscribers: 8750
      },
      {
        channelName: 'FitLife Academy',
        owner: users[2]._id,
        description: 'Transform your body and mind with our fitness programs. Get stronger, healthier, happier!',
        channelBanner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=300&fit=crop',
        subscribers: 12300
      },
      {
        channelName: 'Beat Factory',
        owner: users[3]._id,
        description: 'Original beats, music production tutorials, and behind-the-scenes content.',
        channelBanner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=300&fit=crop',
        subscribers: 6890
      }
    ]);

    console.log('Created demo channels');

  

    console.log('Created demo comments');

    // Create demo videos with valid .mp4 URLs and thumbnails
    const videos = await Video.create([
      // Tech Channel Videos
      {
        title: 'React Hooks Complete Tutorial - useState, useEffect, and More!',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Learn React Hooks from scratch! This comprehensive tutorial covers useState, useEffect, useContext, and custom hooks with practical examples.',
        channelId: channels[0]._id,
        uploader: users[0]._id,
        views: 45230,
        likes: 1250,
        dislikes: 23,
        category: 'Education',
        comments: [
          {
            userId: users[1]._id,
            text: 'Great explanation! Finally understood useEffect properly.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            userId: users[2]._id,
            text: 'This helped me so much with my fitness app project!',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          }
        ]
      },
      {
        title: 'JavaScript ES6+ Features You Must Know in 2024',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        description: 'Master modern JavaScript! Arrow functions, destructuring, async/await, modules, and more ES6+ features explained with examples.',
        channelId: channels[0]._id,
        uploader: users[0]._id,
        views: 32100,
        likes: 890,
        dislikes: 15,
        category: 'Education',
        comments: [
          {
            userId: users[3]._id,
            text: 'Perfect timing! Just what I needed for my web audio project.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
          }
        ]
      },
      {
        title: 'Node.js Backend Development - Complete REST API Tutorial',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        description: 'Build a complete REST API with Node.js, Express, and MongoDB. Authentication, CRUD operations, and best practices covered.',
        channelId: channels[0]._id,
        uploader: users[0]._id,
        views: 28900,
        likes: 1150,
        dislikes: 18,
        category: 'Education'
      },

      // Cooking Channel Videos
      {
        title: '15-Minute Pasta Recipes That Will Change Your Life',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        description: 'Quick and delicious pasta recipes perfect for busy weeknights. Simple ingredients, amazing flavors!',
        channelId: channels[1]._id,
        uploader: users[1]._id,
        views: 28750,
        likes: 1120,
        dislikes: 8,
        category: 'Food',
        comments: [
          {
            userId: users[0]._id,
            text: 'Made this last night - absolutely delicious! Thanks for the recipe.',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
          }
        ]
      },
      {
        title: 'How to Make Perfect Chocolate Chip Cookies',
        thumbnailUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        description: 'The ultimate chocolate chip cookie recipe! Crispy edges, chewy center, and loaded with chocolate chips.',
        channelId: channels[1]._id,
        uploader: users[1]._id,
        views: 19200,
        likes: 750,
        dislikes: 5,
        category: 'Food'
      },
      {
        title: 'Healthy Breakfast Ideas - Quick & Nutritious',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        description: 'Start your day right with these healthy and delicious breakfast recipes. Perfect for busy mornings!',
        channelId: channels[1]._id,
        uploader: users[1]._id,
        views: 15600,
        likes: 680,
        dislikes: 3,
        category: 'Food'
      },

      // Fitness Channel Videos
      {
        title: '30-Minute Full Body HIIT Workout - No Equipment Needed',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        description: 'Burn calories and build strength with this intense 30-minute HIIT workout. Perfect for home workouts!',
        channelId: channels[2]._id,
        uploader: users[2]._id,
        views: 67890,
        likes: 2340,
        dislikes: 45,
        category: 'Sports',
        comments: [
          {
            userId: users[1]._id,
            text: 'This workout is intense! Love the variety of exercises.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
          },
          {
            userId: users[3]._id,
            text: 'Great workout music too! What\'s the playlist?',
            timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
          }
        ]
      },
      {
        title: 'Yoga for Beginners - 20 Minute Morning Flow',
        thumbnailUrl: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/yoga-class-youtube-fitness-thumbnail-design-template-89c3838c0a348328c4f1cc9d9a402fc4_screen.jpg?ts=1698374650',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        description: 'Start your day with this gentle 20-minute yoga flow. Perfect for beginners and all fitness levels.',
        channelId: channels[2]._id,
        uploader: users[2]._id,
        views: 42300,
        likes: 1890,
        dislikes: 12,
        category: 'Sports'
      },

      // Music Channel Videos
      {
        title: 'How to Make Beats in FL Studio - Complete Beginner Guide',
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        description: 'Learn beat making from scratch! Complete FL Studio tutorial for beginners with free sample pack download.',
        channelId: channels[3]._id,
        uploader: users[3]._id,
        views: 15670,
        likes: 580,
        dislikes: 12,
        category: 'Music',
        comments: [
          {
            userId: users[0]._id,
            text: 'Amazing tutorial! The sample pack is fire 🔥',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
          }
        ]
      },
      {
        title: 'Music Theory Basics - Understanding Scales and Chords',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1280&h=720&fit=crop&crop=center',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        description: 'Master the fundamentals of music theory! Learn scales, chords, and how they work together in this comprehensive guide.',
        channelId: channels[3]._id,
        uploader: users[3]._id,
        views: 23400,
        likes: 890,
        dislikes: 8,  
        category: 'Music'
      }
    ]);

    // const comments = await Comment.create([
    //   {
    //     videoId: videos[0]._id,
    //     userId: users[0]._id,
    //     text: 'Great video! Learned a lot from this tutorial.',
    //     timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    //   },
    //   {
    //     videoId: videos[1]._id,
    //     userId: users[1]._id,
    //     text: 'Thanks for sharing this. Could you make a follow-up video on advanced topics?',
    //     timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    //   },
    //   {
    //     videoId: videos[2]._id,
    //     userId: users[2]._id,
    //     text: 'Thanks for watching! Don\'t forget to subscribe for more content.',
    //     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    //   },
    //   {
    //     videoId: videos[3]._id,
    //     userId: users[3]._id,
    //     text: 'Thanks for watching! Don\'t forget to subscribe for more content.',
    //     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    //   },
    // ]);
    console.log('Created demo videos');

    // Update channels with video references
    for (let i = 0; i < channels.length; i++) {
      const channelVideos = videos.filter(video => 
        video.channelId.toString() === channels[i]._id.toString()
      );
      
      await Channel.findByIdAndUpdate(channels[i]._id, {
        videos: channelVideos.map(video => video._id)
      });
    }

    console.log('Updated channel video references');

    console.log('\n=== DEMO DATA CREATED SUCCESSFULLY ===');
    console.log('\nDemo Users (password: password123):');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.username})`);
    });

    console.log('\nDemo Channels:');
    channels.forEach(channel => {
      console.log(`- ${channel.channelName} (${channel.subscribers} subscribers)`);
    });

    console.log(`\nTotal Videos Created: ${videos.length}`);
    console.log('All videos have real YouTube thumbnails and working video URLs!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
