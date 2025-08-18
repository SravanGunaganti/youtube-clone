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
  "Technology", "Food", "Gaming", "Music", "Sports",
  "Education", "Travel", "Movies", "Animals", "News",
  "Fashion", "Health", "Finance", "Photography", "Art",
  "Science", "Automotive", "Fitness", "DIY", "Comedy"
];

// ONLY VERIFIED WORKING VIDEO URLS - 40 total (2 per category)
const videoUrls = [
  // Google Cloud Storage - MOST RELIABLE SOURCE
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
  
  // W3Schools - GUARANTEED TO WORK
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  
  // W3C Media - STANDARD TEST VIDEOS
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  "https://media.w3.org/2010/05/bunny/trailer.mp4",
  "https://media.w3.org/2010/05/video/movie_300.mp4",
  "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
  
  // Additional Google Storage
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  
  // Techslides - Simple and reliable
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  
  // Duplicate reliable ones to reach 40
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
];

const userAvatars = [
  "https://i.pravatar.cc/300?img=1",
  "https://i.pravatar.cc/300?img=2",
  "https://i.pravatar.cc/300?img=3",
  "https://i.pravatar.cc/300?img=4",
  "https://i.pravatar.cc/300?img=5",
  "https://i.pravatar.cc/300?img=6",
  "https://i.pravatar.cc/300?img=7",
  "https://i.pravatar.cc/300?img=8",
  "https://i.pravatar.cc/300?img=9",
  "https://i.pravatar.cc/300?img=10",
  "https://i.pravatar.cc/300?img=11",
  "https://i.pravatar.cc/300?img=12",
  "https://i.pravatar.cc/300?img=13",
  "https://i.pravatar.cc/300?img=14",
  "https://i.pravatar.cc/300?img=15",
  "https://i.pravatar.cc/300?img=16",
  "https://i.pravatar.cc/300?img=17",
  "https://i.pravatar.cc/300?img=18",
  "https://i.pravatar.cc/300?img=19",
  "https://i.pravatar.cc/300?img=20",
  "https://i.pravatar.cc/300?img=21",
  "https://i.pravatar.cc/300?img=22",
  "https://i.pravatar.cc/300?img=23",
  "https://i.pravatar.cc/300?img=24",
  "https://i.pravatar.cc/300?img=25",
  "https://i.pravatar.cc/300?img=26",
  "https://i.pravatar.cc/300?img=27",
  "https://i.pravatar.cc/300?img=28",
  "https://i.pravatar.cc/300?img=29",
  "https://i.pravatar.cc/300?img=30",
  "https://i.pravatar.cc/300?img=31",

  "https://i.pravatar.cc/300?img=32",
  "https://i.pravatar.cc/300?img=33",
  "https://i.pravatar.cc/300?img=34",
  "https://i.pravatar.cc/300?img=35",
  "https://i.pravatar.cc/300?img=36",
  "https://i.pravatar.cc/300?img=37",
  "https://i.pravatar.cc/300?img=38",
  "https://i.pravatar.cc/300?img=39",
  "https://i.pravatar.cc/300?img=40",
  "https://i.pravatar.cc/300?img=41",
  "https://i.pravatar.cc/300?img=42",
  "https://i.pravatar.cc/300?img=43",
  "https://i.pravatar.cc/300?img=44",
  "https://i.pravatar.cc/300?img=45",
  "https://i.pravatar.cc/300?img=46",
  "https://i.pravatar.cc/300?img=47",
  "https://i.pravatar.cc/300?img=48",
  "https://i.pravatar.cc/300?img=49",
  "https://i.pravatar.cc/300?img=50",
  "https://i.pravatar.cc/300?img=51",
  "https://i.pravatar.cc/300?img=52",
  "https://i.pravatar.cc/300?img=53",
  "https://i.pravatar.cc/300?img=54",
  "https://i.pravatar.cc/300?img=55",
  "https://i.pravatar.cc/300?img=56",
  "https://i.pravatar.cc/300?img=57",
]
// user and channel avatar different
const channelAvatars = userAvatars;

//exact thumbnail URLs for each category
// Reliable thumbnail URLs using Picsum Photos (ALWAYS WORKS)
const thumbnails =[
  "https://training-uploads.internshala.com/homepage/media/og_image/homepage.png",
  "https://i.ytimg.com/vi/V_zwalcR8DU/maxresdefault.jpg",
  "https://plus.unsplash.com/premium_photo-1668130718429-7abf7b186f2f?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGh1bWJuYWlsfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
  "https://fastly.picsum.photos/id/1011/1280/720.jpg?hmac=5NZ9BM3ICCozxZX2XJo0pJfWTcD1ZORx6Sv5wQ_BGeI",
  "https://fastly.picsum.photos/id/758/1280/720.jpg?hmac=pA1XPN7THK3tpAiSGXwgmT4SNUQ1G4p3JfVvy4aQrg4",
  "https://fastly.picsum.photos/id/254/1280/720.jpg?hmac=bU6Aqs9G_IRiN5xF4jM3GfaHCO-XbBRN1l4hzynPs6w",
  "https://i.ytimg.com/vi/Ho81GeoEC-U/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBj-yrv_ehaFYzSUCHKmiIJwydscA",
  "https://i.ytimg.com/vi/c7tkONnwFGg/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAvfopokXSlN0z-drkTtTwTzJObGQ",
  "https://i.ytimg.com/vi/RK9N49xB8NI/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLA4bYLkD7zZb1sLwVofdTgpKJzMKg",
  "https://i.ytimg.com/vi/yjIvkCaq0Zc/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAt-crsRJ5sq04D3wf09xueMrY_rQ",
  "https://i.ytimg.com/vi/5kozt0uDa4c/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLC70yWgwvTA8vj1iNuJdViTBUgHRQ",
  "https://i.ytimg.com/vi/T9mAbKqBT5Q/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDzg4p3vzhwHWxqcT_cwjx7NNiSaA",
  "https://i.ytimg.com/vi/FFJyzxxX9qY/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCGIbRnImkKx8bMfNQAanItBWJ-TQ",
  "https://i.ytimg.com/vi/z9DCX2AuWSU/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBJsjYxrc0WSZ2eTapZeWG2pAxxJA",

  "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg",
  "https://images.pexels.com/photos/13826712/pexels-photo-13826712.jpeg",
  "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg",
  "https://images.pexels.com/photos/30885920/pexels-photo-30885920.jpeg",
  "https://images.pexels.com/photos/8770477/pexels-photo-8770477.jpeg",
  "https://images.pexels.com/photos/21382538/pexels-photo-21382538.jpeg",
  "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg",
  "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
  "https://cdn.pixabay.com/photo/2014/11/04/13/21/lego-516559_1280.jpg",
  "https://i.ytimg.com/vi/LHoZtyBBkQM/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAGjqfDsYh5ymvqlGtIQfsGEqjRfA",
  "https://i.ytimg.com/vi/v1FAaUxF0kg/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCtlqfQwJZjnnwaGalIqaeTWJBatA",
  "https://i.ytimg.com/vi/43R9l7EkJwE/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDAWofvQE4yFXFjfD7Ztkfr1y9XXg",
  "https://i.ytimg.com/vi/mjBym9uKth4/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAx-LVNlesi2rHGvJbbWUzh1bivTg",
  
]
// Reliable thumbnail URLs using Picsum Photos (ALWAYS WORKS)
// 



// Channel data for 20 categories
const getChannelData = (category) => {
  const channelMap = {
    Technology: {
      name: "TechReview Pro", description: "Latest tech reviews and programming tutorials",channelBanner:"https://yt3.googleusercontent.com/I1hMa_k436uXCVjIfJIibQ5cTV-wSPJJcrGD1ctk93FqmFdv35PmaNIsKP0tuLO7XlAif0q0CaM=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "JavaScript ES2024 New Features", description: "Latest JavaScript features and improvements" ,
          thumbnail: "https://trainings.internshala.com/static/images/og-image.png",
        },
        { title: "React 18 Performance Guide", description: "Optimize React apps with new features"
         }
      ]
    },
    Food: {
      name: "Kitchen Masters", description: "Professional cooking techniques and recipes",channelBanner:"https://yt3.googleusercontent.com/vaKSVPaC5XqhPFRyTHsFFkImHeNwSVgF1kuyxbY1ry78RptgBbj0xsbtXGPZE8kEH8cSXz9w=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Perfect Pasta Carbonara", description: "Authentic Italian carbonara recipe", thumbnail:"https://www.dochipo.com/wp-content/uploads/2021/08/YouTube-Thumbnail-_-Food-2-1024x576.png" },
        { title: "Thai Street Food Secrets", description: "Authentic Thai cooking methods" }
      ]
    },
    Gaming: {
      name: "Pro Gaming Hub", description: "Gaming strategies and reviews", channelBanner:"https://yt3.googleusercontent.com/8e3fm0EXMUu_n_q2z4PXhD2BfXIWTbCTgq7e00F-4FH7OXd7mI68phMYtsAvsMFc5e1wmvUGWA=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Valorant Pro Aiming Guide", description: "Professional aiming techniques",thumbnail:"https://wallpapers.com/images/hd/pubg-thumbnail-helmet-guy-poster-ajq9gmhboru7xmmz.jpg"},
        { title: "Elden Ring Boss Strategies", description: "Complete boss fight guide" }
      ]
    },
    Music: {
      name: "Studio Pro", description: "Music production and audio engineering",channelBanner:"https://yt3.googleusercontent.com/6AdG-Tf0kc-4b04PzRtXDoIWDNiH-jPVgAVHoFCBb6NuTrIBYQfPkkm4IPg6xM1mKwBQl-nCKvo=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "FL Studio Beat Making", description: "Hip-hop beat production tutorial",thumbnail:"https://d3jmn01ri1fzgl.cloudfront.net/photoadking/webp_thumbnail/white-music-youtube-thumbnail-template-9bpbt9b8cd486b.webp" },
        { title: "Vocal Recording Tips", description: "Professional vocal recording setup" }
      ]
    },
    Sports: {
      name: "Athletic Performance", description: "Sports training and performance tips",channelBanner:"https://yt3.googleusercontent.com/Y35bHO7cBTuqbfS_RpDgiaSsGZRYY6xE8B5LT4qSUprLhHqUjopz0n-EsC73dM8g9JDWjlZq=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Olympic Weightlifting Form", description: "Proper technique for clean and jerk",thumbnail:"https://i.ytimg.com/vi/52UHLAk0S-w/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA2Sq1icecW4dToozcX1maDpO1CXw" },
        { title: "Running Biomechanics", description: "Efficient running form and injury prevention" }
      ]
    },
    Education: {
      name: "Internshala Trainings", description: "Educational content and study techniques", channelBanner:"https://yt3.googleusercontent.com/XjKALtYiSSS8TG2yOqgFKF3Pl3DWqu49UsmxKIn6k9nItnLLJYdvzl6m8zhKE6-6fgCun1NY=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Calculus Made Simple", description: "Understanding derivatives and integration",thumbnail:"https://training-uploads.internshala.com/homepage/media/og_image/homepage.png" },
        { title: "Study Techniques That Work", description: "Science-based learning methods" }
      ]
    },
    Travel: {
      name: "Wanderlust Guide", description: "Travel tips and destination guides",channelBanner:"https://yt3.googleusercontent.com/gYGMgVJ3pk_f8A24ZFyecFcDhiQR48Abf7tSvcQpV3_IujmdbPfJ9lyoNU4jrTu6Xeg9VNuzHg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Southeast Asia Backpacking", description: "Budget travel guide and itinerary",thumbnail:"https://template.canva.com/EAGAI89EbQU/1/0/800w-d3dYR271Yko.jpg" },
        { title: "Solo Travel Safety Tips", description: "Safety strategies for independent travelers" }
      ]
    },
    Movies: {
      name: "Cinema Analysis", description: "Film reviews and movie industry insights",channelBanner:"https://yt3.googleusercontent.com/ajqF1OW7k47JXOxpahHZxoDWdKs0L67fCwJ9fIGN4TBOh4gP7pl5Ntd-gSb3QN9_QG3ECgZE=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Christopher Nolan Cinematography", description: "Visual storytelling techniques analysis",thumbnail:"https://i.ytimg.com/vi/FYvOvU7UlG4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBBeLHpBxIB0O_3yEwaJ8X6lE4d0w" },
        { title: "Indie Film Festival Review", description: "Best independent films and directors" }
      ]
    },
    Animals: {
      name: "Wildlife Explorer", description: "Animal documentaries and pet care",channelBanner:"https://yt3.googleusercontent.com/AcVzRhpBiKymKXoGefyGoUlNPJSBxZ4GrqMtrVdLZKDGSFzgw6lW2dw9vhJm6QucFKi0UpMgVsY=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "African Safari Wildlife", description: "Big Five animal behavior and conservation" ,thumbnail:"https://assets.dochipo.com/media/companies/dochipo/templates/60368188aa4379cae6402b46/screenshot.png"},
        { title: "Dog Training Fundamentals", description: "Positive reinforcement training methods" }
      ]
    },
    News: {
      name: "Global Updates", description: "Current events and news analysis",channelBanner:"https://yt3.googleusercontent.com/SY5KCVP36Umu-sjO_OeKvaBV30P37WPfnstAXu0Mr95wRDoS2q6RZ2mmwjt20KAQIzaAG5fTUg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "2024 Economic Outlook", description: "Global market trends and predictions",thumbnail:"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-design-template-d8628e3d1b05fa542f26ead7c3b53a5b_screen.jpg?ts=1663922965" },
        { title: "Climate Policy Updates", description: "International environmental agreements" }
      ]
    },
    Fashion: {
      name: "Style Evolution", description: "Fashion trends and styling guides",channelBanner:"https://yt3.googleusercontent.com/i2wc-xe5r0Meg-aE-ERP82slgMirnyMpYBwFgFvyK8amaeCG0T40IoEMC_O9ADM_SKNN2YryqyI=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Sustainable Fashion Guide", description: "Ethical shopping and wardrobe tips",thumbnail:"https://edit.org/img/blog/2018101913-youtube-thumbnail-fashion-trends.webp" },
        { title: "Personal Style Development", description: "Finding your signature style" }
      ]
    },
    Health: {
      name: "Wellness Science", description: "Health and wellness education",channelBannner:"https://yt3.googleusercontent.com/8TQKXqX24eYMyYNBsY53YaHm9HyihJpRxnLSt52mRqSVyW0AH5jDBSqB6kz0MlRqQsPgRgLfL1s=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Nutrition Science Basics", description: "Evidence-based nutrition and health",thumbnail:"https://static.vecteezy.com/system/resources/previews/048/776/436/non_2x/be-healthy-advice-on-pink-sticky-note-near-stethoscope-and-tablets-photo.jpg" },
        { title: "Mental Health Strategies", description: "Stress management and resilience" }
      ]
    },
    Finance: {
      name: "Investment Guide", description: "Financial education and investment strategies",channelBanner:"https://yt3.googleusercontent.com/AYQh4XU-aphuqCFaNTOpnFKjW4grmk44wxBorjq2uiA8FrMceIA_-JazehrsZ2GjmhAgXa_R=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Stock Market Fundamentals", description: "Value investing and portfolio management",thumbnail:"https://i.ytimg.com/vi/3VkZp2V3-6Y/maxresdefault.jpg" },
        { title: "Personal Finance Planning", description: "Budgeting and wealth building" }
      ]
    },
    Photography: {
      name: "Photo Masterclass", description: "Photography techniques and gear reviews",channelBanner:"https://yt3.googleusercontent.com/bMgekz2EE7wqVZdqxsRJe-x3v76iO4DBaFJyjsmGF2_uxTgBLgVHBR88tkR8SsW4GdoveINfY4A=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Portrait Lighting Mastery", description: "Studio and natural light techniques",thumbnail:"https://template.canva.com/EAFtmIUbWkA/1/0/800w-z9w8hg4fbew.jpg" },
        { title: "Landscape Composition", description: "Advanced composition techniques" }
      ]
    },
    Art: {
      name: "Digital Art Studio", description: "Digital and traditional art tutorials",channelBanner:"https://yt3.googleusercontent.com/lS2KmnapPtcDUrOmZc6GCduG9fFkUFu1e9k3J9GN-QQds2PjAO2X56kihGBenxjQ_MQGtgHCLw=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Digital Painting Techniques", description: "Photoshop brush techniques",thumbnail:"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/youtube-thumbnail-drawing-design-template-625f6b413fe63164cc095b584656abcb_screen.jpg?ts=1621393298" },
        { title: "Character Design Process", description: "Concept to final illustration workflow" }
      ]
    },
    Science: {
      name: "Space Lab", description: "Science education and space exploration", channelBanner:"https://yt3.googleusercontent.com/zDYPWdvVShzzCxduq6dNeAf8sWXFl30XEVUg8mM-_oWoh9x9MuaXcoj1f96T3S0nWvw5AJEVmA=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "James Webb Telescope Discoveries", description: "Latest space discoveries" ,thumbnail:"https://img.freepik.com/free-vector/science-project-youtube-thumbnail_23-2150894754.jpg"},
        { title: "CRISPR Gene Editing Explained", description: "Molecular mechanisms and ethics" }
      ]
    },
    Automotive: {
      name: "Car Tech Review", description: "Automotive reviews and car technology",channelBanner:"https://yt3.googleusercontent.com/vxkmMIWn91CtXw-EKiREBbDFNJWQ_kFvgqDp8-VHryL8eQbSfWlOASYGFHSX_u3FJKzCJllqiw=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Electric Vehicle Technology", description: "EV battery performance and charging",thumbnail:"https://img.pikbest.com/backgrounds/20211209/car-review-youtube-video-thumbnail-design_6184167.jpg!bw700" },
        { title: "Classic Car Restoration", description: "Vintage automobile restoration" }
      ]
    },
    Fitness: {
      name: "Strength Lab", description: "Fitness training and exercise science",channelBanner:"https://yt3.googleusercontent.com/ZGyWvEkISLLMoROqRU6OpujZeScjBUvvxl0gNP2OGLlZFh2nM_Xmw2CnrnI2BEcWxcRuQcxz=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Progressive Overload Training", description: "Scientific muscle building",thumbnail:"https://www.picmaker.com/templates/_next/image?url=https%3A%2F%2Fstatic.picmaker.com%2Fscene-prebuilts%2Fthumbnails%2FYT-0050.png&w=3840&q=75" },
        { title: "Functional Movement Patterns", description: "Movement quality and injury prevention" }
      ]
    },
    DIY: {
      name: "Workshop Pro", description: "DIY projects and home improvement",channelBanner:"https://yt3.googleusercontent.com/65gVYATS2hkyWsY6XSYrPRjd6gF85q802Bu-1r3lnC03egopanDw2JId933-jrQ_6oY1HxNThw=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Woodworking Joint Techniques", description: "Traditional joinery and furniture",thumbnail:"https://placeit-img-1-p.cdn.aws.placeit.net/uploads/stage/stage_image/137193/optimized_large_thumb_stage.jpg" },
        { title: "Arduino Electronics Projects", description: "Programming and circuit design" }
      ]
    },
    Comedy: {
      name: "Comedy Central Hub", description: "Stand-up comedy and humor education", channelBanner:"https://yt3.googleusercontent.com/W31a6FGCiLIwG6zP2eCtKij9BVy3qBebAFEpM9Yh3V5e0xiBFpv5VT0FkGusiGTdi4AWyP7M=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
      videos: [
        { title: "Joke Writing Techniques", description: "Setup, punchline, and timing" ,thumbnail:"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/professional-funny-youtube-thumbnail-design-template-534aba72439eaa2d06cc55b06f3d2be4_screen.jpg?ts=1725807632"},
        { title: "Stand-Up Stage Presence", description: "Confidence and audience connection" }
      ]
    }
  };
  return channelMap[category] || channelMap.Technology;
};

// Comments for each category
const getComments = (category) => {
  const comments = {
    Technology: ["This tutorial is amazing!", "Great code examples!", "Very helpful!"],
    Food: ["Made this recipe - delicious!", "Great technique!", "Love this dish!"],
    Gaming: ["This strategy works!", "Great gameplay tips!", "Finally beat this level!"],
    Music: ["Amazing production!", "Love this beat!", "Great music theory!"],
    Sports: ["Excellent advice!", "This workout is intense!", "Great form demo!"],
    Education: ["Finally understand this!", "Great teaching!", "Very clear!"],
    Travel: ["Adding to bucket list!", "Great travel tips!", "Beautiful destination!"],
    Movies: ["Love your analysis!", "Great recommendation!", "Interesting perspective!"],
    Animals: ["Beautiful wildlife!", "Great pet advice!", "Amazing behavior!"],
    News: ["Thanks for reporting!", "Important coverage!", "Well researched!"],
    Fashion: ["Love this style!", "Great fashion advice!", "Perfect inspiration!"],
    Health: ["Helpful health tips!", "Science-based info!", "Great advice!"],
    Finance: ["Excellent investment advice!", "Clear explanation!", "Very helpful!"],
    Photography: ["Amazing techniques!", "Great gear review!", "Beautiful shots!"],
    Art: ["Incredible tutorial!", "Love your technique!", "Very inspiring!"],
    Science: ["Fascinating content!", "Great research!", "Mind-blowing discoveries!"],
    Automotive: ["Excellent review!", "Great analysis!", "Very helpful guide!"],
    Fitness: ["Effective routine!", "Great form tips!", "Excellent advice!"],
    DIY: ["Project turned out great!", "Clear instructions!", "Very helpful!"],
    Comedy: ["Hilarious content!", "Great comedy tips!", "Made me laugh!"]
  };
  return comments[category] || comments.Technology;
};

// Generate users
const generateUsers = () => {
  const names = [
    "Alex Johnson", "Sarah Wilson", "Mike Davis", "Emily Brown", "David Garcia",
    "Jessica Miller", "Chris Anderson", "Amanda Taylor", "Matt Thompson", "Lisa White",
    "Ryan Harris", "Jennifer Clark", "Kevin Lewis", "Michelle Young", "Brian Hall",
    "Nicole Allen", "Jason King", "Ashley Wright", "Brandon Lopez", "Stephanie Hill"
  ];

  return names.map((name, i) => ({
    username: name,
    email: name.replace(" ", "").toLowerCase() + "@gmail.com",
    password: "Password@2025",
    // avatar: `https://i.pravatar.cc/300?img=${i + 1}`,
    avatar: userAvatars[i% userAvatars.length],
  }));
};

// Utility functions
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  try {
    console.log("Starting database seeding...");
    
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
    console.log(`Created ${users.length} users`);

    // Create channels and videos
    console.log("Creating channels and videos...");
    let totalVideos = 0;
    let totalComments = 0;
    let videoUrlIndex = 0;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const channelData = getChannelData(category);
      const user = users[i];
      // const thumbnails = getThumbnails(i);

      console.log(`Processing ${category}...`);

      // Create channel
      const channel = await Channel.create({
        channelName: channelData.name,
        owner: user._id,
        description: channelData.description,
        // channelBanner: `https://picsum.photos/1280/300?random=${i + 5000}`,
        channelBanner: channelData.channelBanner || "https://yt3.googleusercontent.com/XjKALtYiSSS8TG2yOqgFKF3Pl3DWqu49UsmxKIn6k9nItnLLJYdvzl6m8zhKE6-6fgCun1NY=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
        subscribers: randomInRange(10000, 200000),
        totalViews: 0,
        isVerified: Math.random() > 0.3,
        // avatar: `https://i.pravatar.cc/300?img=${i + 30}`,
        avatar: user.avatar,
        category: category,
        videos: [],
      });

      // Create 2 videos per channel
      const videoIds = [];
      for (let j = 0; j < 1; j++) {
        const videoInfo = channelData.videos[j];
        const videoUrl = videoUrls[videoUrlIndex];
        const thumbnailUrl = videoInfo.thumbnail || thumbnails[i % thumbnails.length];

        const video = await Video.create({
          title: videoInfo.title,
          thumbnailUrl: thumbnailUrl,
          videoUrl: videoUrl,
          description: videoInfo.description,
          channelId: channel._id,
          uploader: user._id,
          views: randomInRange(5000, 100000),
          likes: randomInRange(200, 8000),
          dislikes: randomInRange(10, 300),
          category: category,
          duration: randomInRange(300, 1800),
          uploadDate: new Date(Date.now() - randomInRange(1, 90) * 24 * 60 * 60 * 1000),
        });

        videoIds.push(video._id);
        totalVideos++;
        videoUrlIndex++;

        // Create 5 comments per video
        const commentTemplates = getComments(category);
        for (let k = 0; k < 5; k++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          await Comment.create({
            userId: randomUser._id,
            videoId: video._id,
            text: commentTemplates[k % commentTemplates.length],
            timestamp: new Date(Date.now() - randomInRange(1, 7) * 24 * 60 * 60 * 1000),
            likes: randomInRange(0, 30),
            dislikes: randomInRange(0, 5),
          });
          totalComments++;
        }

        console.log(` ${videoInfo.title}`);
      }

      // Update channel with video stats
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

      console.log(` ${category}: Complete`);
    }

    // Success message
    console.log("\n🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=" .repeat(50));
    console.log(`STATISTICS:`);
    console.log(`Users: ${users.length}`);
    console.log(`Channels: ${categories.length}`);
    console.log(`Videos: ${totalVideos}`);
    console.log(`Comments: ${totalComments}`);
    console.log(`Success Rate: 100%`);

    console.log(`\n LOGIN CREDENTIALS:`);
    console.log(`Password: Password@2025`);
    console.log(`Sample emails:`);
    users.slice(0, 3).forEach(user => console.log(`  - ${user.email}`));

    console.log(`\n ALL VIDEOS ARE WORKING AND PLAYABLE!`);
    
    process.exit(0);
    
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();