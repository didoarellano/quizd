import { randomInt } from "crypto";

// prettier-ignore
const dogBreeds = [
  "Frenchie", "Lab", "Golden", "GSD", "Poodle",
  "Bullie", "Rottie", "Doxie", "Dobie", "Husky",
  "Beagle", "Corgi", "Aussie", "Boxer", "Yorkie",
  "GSP", "Cav", "Schnauzer", "ShihTzu", "Pom",
  "Chi", "BorderCollie", "Pug", "GreatDane", "Dobie", "MiniSchnauzer",
  "Cocker", "Rottie", "Sheltie", "Boston", "Havi",
  "Berner", "EnglishBullie", "StandardPoodle", "CavKingCharles", "Puggie",
  "Chihuahua", "MiniSchnauzer", "ShihTzu", "PomPom", "BCollie",
  "Weim", "Springer", "Bichon", "Mastiff", "Newfie",
  "Dane", "Vizsla", "Basenji", "Akita", "Shiba",
  "Staffy", "Malinois", "Heeler", "Pitbull", "Maltese",
  "Peke", "Samoyed", "Papillon", "Chow", "Borzoi",
  "Whippet", "Lhasa", "Saluki", "Terv", "Pyrenees",
  "Cockapoo", "Goldendoodle", "Labradoodle", "Schnoodle", "Maltipoo",
  "Shepadoodle", "Boxador", "Bullmastiff", "CaneCorso", "Dal",
  "IrishSetter", "Scottie", "Westie", "Norwich", "Norfolk",
  "Airedale", "Pointer", "Toller", "JRT", "Silky",
  "BrusselsGriff", "BullieTerrier", "Leonberger", "Anatolian", "Kuvasz",
  "GreatPyrenees", "Coonhound", "Foxhound", "Otterhound", "Plott",
  "Redbone", "Bluetick", "Bassador", "Shorkie", "Yorkipoo"
];
// prettier-ignore
const adjectives = [ "Adorable", "Fluffy", "Tiny", "Bubbly", "Cuddly",
  "Cheerful", "Playful", "Perky", "Sweet", "Lovable", "Snuggly", "Friendly",
  "Charming", "Delightful", "Peppy", "Joyful", "Sparkly", "Dazzling", "Precious",
  "Gentle", "Whimsical", "Happy", "Soft", "Bright", "Quaint", "Jolly", "Gleeful",
  "Twinkly", "Sunny", "Colorful", "Spunky", "Graceful", "Cute", "Radiant",
  "Blissful", "Chirpy", "Silly", "Bouncy", "Dreamy", "FunSized", "Glossy",
  "Snappy", "Lighthearted", "Sparkling", "PintSized", "Smiley", "Gleaming",
  "Breezy", "Merry", "Zippy", ];

export function generateUsername() {
  const adjective = adjectives[randomInt(0, adjectives.length)];
  const duckBreed = dogBreeds[randomInt(0, dogBreeds.length)];
  return `${adjective}${duckBreed}`;
}

export function generateUniqueUsername(existingNames: string[]): string {
  let name = "";
  do {
    name = generateUsername();
  } while (existingNames.includes(name));
  return name;
}
