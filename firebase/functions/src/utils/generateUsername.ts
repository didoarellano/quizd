import { randomInt } from "crypto";

// prettier-ignore
const duckBreeds = [ "AbacotRanger", "African", "Alabio", "Allier",
  "AmericanPekin", "Ancona", "Appleyard", "AustralianCall", "AustralianSpotted",
  "Aylesbury", "BacKinh", "Bali", "Bashkir", "Bau", "Blekinge", "Bourbourg",
  "Crested", "Call", "Cayuga", "Challans", "CharaChamble", "Crested", "Danish",
  "Dendermond", "DeshiBlack", "DeshiWhite", "Duclair", "EastIndie", "Elizabeth",
  "Estaires", "Faroese", "Forest", "GermanPekin", "GermanataVeneta",
  "Gimbsheimer", "GoldenCascade", "Gressingham", "GrimaoErmaôs", "HautVolant",
  "Havanna", "Herve", "HookBill", "Hungarian", "Huttegem", "IndianRunner",
  "Idegem", "IndianRunner", "JapaniceCriollo", "Jending", "Kaiya",
  "KhakiCampbell", "Laplaigne", "Muscovy", "Magpie", "Merchtem", "Mulard",
  "Muscovy", "NakedNeck", "Orpington", "Overberg", "Pomeranian", "Pond",
  "RouenClair", "Rouen", "SilverAppleyard", "Saxony", "Semois", "Shetland",
  "SilverAppleyard", "SilverBantam", "SwedishBlue", "SwedishYellow", "TeaAnkam",
  "TeaKapa", "Termonde", "Tsaiya", "UkrainianClay", "UkrainianGrey",
  "UkrainianWhite", "Venetian", "WelshHarlequin", "Watervale", "WelshHarlequin",
  "WestIndian", "WhiteBreastedBlack", ];
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
  const duckBreed = duckBreeds[randomInt(0, duckBreeds.length)];
  return `${adjective}${duckBreed}`;
}

export function generateUniqueUsername(existingNames: string[]): string {
  let name = "";
  do {
    name = generateUsername();
  } while (existingNames.includes(name));
  return name;
}
