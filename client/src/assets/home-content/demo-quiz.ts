import { Quiz } from "@/types/quiz";

export const demoMDText = `---
title: Doggies
---

## Which breed is known for having a blue-black tongue? {- 30s}

- [ ] Golden Retriever
- [ ] Dalmatian
- [x] Chow Chow
- [ ] Poodle

## What is the fastest dog breed? {- 1m}

- [ ] Border Collie
- [x] Greyhound
- [ ] Siberian Husky
- [ ] Doberman

## Which small dog breed was originally bred for hunting rats? {- 60s}

- [ ] Dachshund
- [ ] Chihuahua
- [x] Yorkshire Terrier
- [ ] Shih Tzu

## What is the smallest dog breed in the world? {- 2m}

- [ ] Pomeranian  
- [x] Chihuahua  
- [ ] Maltese  
- [ ] Toy Poodle  

## Which dog breed starred as "Rin Tin Tin," the famous Hollywood canine actor? {- 42s}

- [ ] Golden Retriever  
- [ ] Labrador Retriever  
- [x] German Shepherd  
- [ ] Alaskan Malamute  
`;

export const demoQuiz: Partial<Quiz> = {
  title: "Doggies",
  questions: [
    {
      id: "vc4qv0Uvw7TGxo9z3gMY",
      heading: "Which breed is known for having a blue-black tongue?",
      body: "",
      duration: 30,
      options: [
        {
          id: "7ZVNGRLxvQ2bGQt44bTR",
          text: "Golden Retriever\n",
        },
        {
          id: "lOJwkfUK7yGpedFsUvQB",
          text: "Dalmatian\n",
        },
        {
          id: "mrZZXVuE6IZSoaxeIqIo",
          text: "Chow Chow\n",
        },
        {
          id: "recbccvAi4Zb9ljIkxd7",
          text: "Poodle\n",
        },
      ],
      answers: ["mrZZXVuE6IZSoaxeIqIo"],
    },
    {
      id: "9sEL73F7gQmu8y98s8hB",
      heading: "What is the fastest dog breed?",
      body: "",
      duration: 60,
      options: [
        {
          id: "pYLduRGGIygxBGcMhZkP",
          text: "Border Collie\n",
        },
        {
          id: "6fo0CsMoqVRgVWttwBWj",
          text: "Greyhound\n",
        },
        {
          id: "4q3jkdRtbN2YDvfU0fzr",
          text: "Siberian Husky\n",
        },
        {
          id: "5lYJAN2HxdRyfsvkk25K",
          text: "Doberman\n",
        },
      ],
      answers: ["6fo0CsMoqVRgVWttwBWj"],
    },
    {
      id: "Rhq9LhjLFBxtTpsseoe5",
      heading: "Which small dog breed was originally bred for hunting rats?",
      body: "",
      duration: 60,
      options: [
        {
          id: "yLw6Pi3BkKCASY4LLdpu",
          text: "Dachshund\n",
        },
        {
          id: "o43nFTrCzzbslNYlWSMZ",
          text: "Chihuahua\n",
        },
        {
          id: "S9uRcJkB1hodtIluTNkS",
          text: "Yorkshire Terrier\n",
        },
        {
          id: "hSBgT0N4o3cxn337Z9nb",
          text: "Shih Tzu\n",
        },
      ],
      answers: ["S9uRcJkB1hodtIluTNkS"],
    },
    {
      id: "6VzUkyyG8zQ5evWM3ORU",
      heading: "What is the smallest dog breed in the world?",
      body: "",
      duration: 120,
      options: [
        {
          id: "b89lagu8lRNgsu8JRlGe",
          text: "Pomeranian\n",
        },
        {
          id: "zDZDvjCUnBbtOxXbJbzF",
          text: "Chihuahua\n",
        },
        {
          id: "JtsckeXHcLcGwoAUEjCh",
          text: "Maltese\n",
        },
        {
          id: "m5HcRqyJv5OXKok0Rd0I",
          text: "Toy Poodle\n",
        },
      ],
      answers: ["zDZDvjCUnBbtOxXbJbzF"],
    },
    {
      id: "WPDUyMaArDD8NNDSNZ1u",
      heading:
        'Which dog breed starred as "Rin Tin Tin," the famous Hollywood canine actor?',
      body: "",
      duration: 42,
      options: [
        {
          id: "0pB8PIvqCNkCVJEHhV0f",
          text: "Golden Retriever\n",
        },
        {
          id: "sb87Q7G9s1uI7nwRGP0t",
          text: "Labrador Retriever\n",
        },
        {
          id: "hpvFcAt5k20tHHyQ2ml6",
          text: "German Shepherd\n",
        },
        {
          id: "7JeTX4a0bmEawdevWvdR",
          text: "Alaskan Malamute\n",
        },
      ],
      answers: ["hpvFcAt5k20tHHyQ2ml6"],
    },
  ],
};
