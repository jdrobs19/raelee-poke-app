# Raelee's Pokedex

A responsive React and TypeScript Pokedex application powered by [PokeAPI](https://pokeapi.co/) and Firebase. Browse the Pokemon index, inspect individual Pokemon, compare selections, and save a personal collection.

[Raelee's Pokédex](https://raelee-poke-app.web.app/)

## Features

- Browse the PokeAPI Pokemon index, with details loaded for visible results
- Search Pokemon by name with case-insensitive partial matching
- Choose 10, 25, 50, or 100 Pokemon per page
- View individual Pokemon overview, evolution chain, abilities, moves, and type information
- Queue up to two Pokemon for side-by-side comparison
- Add Pokemon to a personal collection and remove them later
- Register and sign in with Firebase Authentication from the My Pokemon page
- Store each user's collection in Cloud Firestore
- Responsive layout for desktop and mobile screens

TCG card pages are present in the navigation and Pokemon detail tabs but are currently marked as coming soon.

## Tech Stack

- React 19
- TypeScript
- React Router DOM
- Firebase Authentication and Cloud Firestore
- `@tcgdex/sdk` and `extract-colors`
- React Icons
- React Toastify
- Create React App

## Getting Started

### Prerequisites

- Node.js and npm
- A Firebase project with Email/Password Authentication enabled
- A Cloud Firestore database

### Installation

1. Clone the repository and open the project directory.
2. Install dependencies:

	```bash
	npm install
	```

3. Configure Firebase in `src/firebase/firebaseConfig.js` with the credentials for your Firebase project.
4. Start the development server:

	```bash
	npm start
	```

The app opens at `http://localhost:3000`.

## Firebase Configuration

The app uses the following Firebase services:

- Firebase Authentication with email and password sign-in
- Cloud Firestore collection named `pokemon`

Pokemon documents are stored in the `pokemon` collection and associated with the signed-in user's Firebase UID through the `user` field. Configure Firestore security rules so users can only read and modify their own documents.

Do not commit private credentials or production secrets. For a production deployment, use the configuration approach recommended by your hosting provider.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server |
| `npm run build` | Create an optimized production build |
| `npm test` | Run the test suite |
| `npm run eject` | Eject from Create React App |

## Application Routes

| Route | Description |
| --- | --- |
| `/search` | Search and browse Pokemon |
| `/pokemon/:id` | View details for a Pokemon, including overview, evolution, moves, and TCG card tabs |
| `/compare` | Compare the two Pokemon currently in the comparison queue |
| `/list` | Sign in, register, and view the user's saved Pokemon |
| `/tcgcards` | My TCG Cards page, currently coming soon |

Any unknown route redirects to `/pokemon/1`.

## Data Source

Pokemon data is loaded from the PokeAPI. The app fetches the Pokemon index and individual Pokemon details, including names, types, abilities, moves, stats, sprites, and evolution-chain information.
