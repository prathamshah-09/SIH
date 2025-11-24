// Username generation with random word combinations
const adjectives = [
  'Quiet', 'Gentle', 'Bright', 'Swift', 'Noble', 'Calm', 'Bold', 'Wise', 'Kind', 'Strong',
  'Peaceful', 'Cheerful', 'Brave', 'Happy', 'Clever', 'Graceful', 'Lively', 'Radiant',
  'Serene', 'Vibrant', 'Mystic', 'Golden', 'Silver', 'Crystal', 'Cosmic', 'Azure',
  'Emerald', 'Crimson', 'Ivory', 'Amber', 'Pearl', 'Jade', 'Ruby', 'Sapphire',
  'Diamond', 'Opal', 'Velvet', 'Silk', 'Satin', 'Marble', 'Steel', 'Iron',
  'Electric', 'Magnetic', 'Digital', 'Cyber', 'Ultra', 'Mega', 'Super', 'Hyper',
  'Neo', 'Proto', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime'
];

const nouns = [
  'Mountain', 'Ocean', 'River', 'Forest', 'Valley', 'Island', 'Desert', 'Garden',
  'Meadow', 'Canyon', 'Summit', 'Creek', 'Lake', 'Pond', 'Falls', 'Ridge',
  'Phoenix', 'Dragon', 'Tiger', 'Wolf', 'Eagle', 'Falcon', 'Lion', 'Bear',
  'Dolphin', 'Whale', 'Shark', 'Hawk', 'Owl', 'Fox', 'Deer', 'Rabbit',
  'Star', 'Moon', 'Sun', 'Comet', 'Galaxy', 'Nebula', 'Planet', 'Cosmos',
  'Aurora', 'Meteor', 'Quasar', 'Pulsar', 'Supernova', 'Constellation',
  'Thunder', 'Lightning', 'Storm', 'Wind', 'Rain', 'Snow', 'Frost', 'Mist',
  'Cloud', 'Shadow', 'Light', 'Flame', 'Spark', 'Ember', 'Blaze', 'Fire',
  'Ice', 'Crystal', 'Gem', 'Stone', 'Rock', 'Boulder', 'Cliff', 'Cave',
  'Castle', 'Tower', 'Bridge', 'Gate', 'Path', 'Road', 'Trail', 'Journey'
];

export const generateRandomUsername = () => {
  // Get random adjective and noun
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  // Generate random number between 10-99
  const randomNumber = Math.floor(Math.random() * 90) + 10;
  
  // Combine them
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

export const generateMultipleUsernames = (count = 5) => {
  const usernames = [];
  const used = new Set();
  
  while (usernames.length < count && used.size < adjectives.length * nouns.length) {
    const username = generateRandomUsername();
    if (!used.has(username)) {
      used.add(username);
      usernames.push(username);
    }
  }
  
  return usernames;
};