/* =============================================
   DEN & ANNA - Configuration
   ============================================= */

// Supabase Configuration
// IMPORTANT: Replace these with your actual Supabase credentials
const SUPABASE_CONFIG = {
  url: 'https://prnjgpgrlsulxsbglyxf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybmpncGdybHN1bHhzYmdseXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzc1ODUsImV4cCI6MjA4MTA1MzU4NX0.53TdHTVK9O6ZFJ6EWtS107cYcIQP9iA0DGBGTO_KVs8'
};

// App Configuration
const APP_CONFIG = {
  appName: 'Den & Anna',
  anniversaryDate: new Date('2018-05-02T00:00:00'),
  users: {
    dennis: {
      name: 'Dennis',
      avatar: 'photos/Image1.jpg',
      username: 'Dennis'
    },
    anna: {
      name: 'Anna',
      avatar: 'photos/Image2.jpg',
      username: 'Anna'
    }
  },
  password: 'Deanna_0502'
};

// Photo Configuration
const PHOTOS = [
  'Image1.jpg', 'Image2.jpg', 'Image3.jpg', 'Image4.jpg', 'Image5.jpg',
  'Image6.jpg', 'Image7.jpg', 'Image8.jpg', 'Image9.jpg', 'Image10.jpg',
  'Image11.jpg', 'Image12.jpg', 'Image13.jpg', 'Image14.jpg', 'Image15.jpg',
  'Image16.jpg', 'Image17.jpg', 'Image18.jpg', 'Image19.jpg', 'Image20.jpg',
  'Image21.jpg', 'Image22.jpg', 'Image23.JPG', 'Image24.jpg', 'Image25.jpg',
  'Image26.jpg', 'Image28.jpg', 'Image29.jpg', 'Image31.jpg', 'Image32.jpg',
  'Image33.jpg', 'Image34.jpg', 'Image35.jpg', 'Image36.jpg', 'Image37.jpg',
  'Image38.jpg', 'Image39.jpg', 'Image40.jpg', 'Image41.jpg', 'Image42.jpg',
  'Image43.jpg', 'Image44.jpg', 'Image45.jpg', 'Image46.jpg', 'Image47.jpg',
  'Image48.jpg', 'Image49.jpg', 'Image50.jpg', 'Image51.jpg', 'Image52.jpg',
  'Image53.jpg', 'Image54.jpg', 'Image55.jpg', 'Image56.jpg', 'Image57.jpg',
  'Image58.jpg', 'Image59.jpg', 'Image60.jpg', 'Image61.jpg', 'Image62.jpg',
  'Image63.jpg', 'Image64.jpg', 'Image65.jpg', 'Image66.jpg', 'Image67.jpg',
  'Image68.jpg', 'Image69.jpg', 'Image70.jpg', 'Image71.jpg', 'Image72.jpg',
  'Image73.jpg', 'Image74.jpg', 'Image75.jpg', 'Image76.jpg', 'Image77.jpg',
  'Image78.jpg', 'Image79.jpg', 'Image80.jpg', 'Image81.jpg', 'Image82.jpg',
  'Image83.jpg', 'Image84.jpg', 'Image85.jpg', 'Image86.jpg', 'Image87.jpeg',
  'Image88.jpeg', 'Image89.jpeg'
];

// Export for use in other modules
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.PHOTOS = PHOTOS;
