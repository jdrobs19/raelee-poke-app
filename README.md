# Raelee's Pokédex

A responsive Pokémon tracker and collection app built with React, TypeScript, Firebase, the [PokeAPI](https://pokeapi.co/), and the [TCGDex API](https://tcgdex.dev/). Users can search and browse Pokémon, view detailed pages, compare up to two Pokémon side-by-side, and save both Pokémon and TCG cards to a personal collection tied to their Firebase account.

Live app: [Raelee's Pokédex](https://raelee-poke-app.web.app/)

## Current Features

- Browse and search Pokémon by name with case-insensitive matching
- View paginated Pokémon results with page-size controls
- Open detailed Pokémon pages with overview, evolution, moves, stats, and typing information
- Compare up to two selected Pokémon in a side-by-side comparison view
- Add or remove Pokémon from a saved collection
- Sign in or register with Firebase Authentication
- Store each user's saved Pokémon in Cloud Firestore using the signed-in Firebase UID
- Save and manage TCG cards in a personal collection, with search and pagination
- View My Pokémon and My TCG Cards pages from the authenticated account flow
- Responsive layout designed for desktop and mobile screens

## Tech Stack

- React 19
- TypeScript
- React Router
- Firebase Authentication and Cloud Firestore
- PokeAPI data integration
- TCGDex data integration
- React Toastify
- React Icons
- Extract Colors
- Create React App

## Getting Started

### Prerequisites

- Node.js and npm
- A Firebase project with Email/Password Authentication enabled
- A Firestore database for user collections

### Installation

1. Clone the repository and open the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your Firebase credentials in `src/firebase/firebaseConfig.js`.
4. Start the development server:

   ```bash
   npm start
   ```

The app will run at `http://localhost:3000`.

## Firebase Configuration

This app uses Firebase for the authenticated user experience and personal collections.

- Authentication: email/password sign-in and registration
- Firestore collections:
  - `pokemon` for saved Pokémon
  - `tcgCards` for saved trading cards

The saved documents are associated with the current user via the `user` field, which stores the Firebase UID. Firestore security rules should ensure that each user can only read and modify records that belong to their account.

Do not commit Firebase secrets or production credentials. Use environment-safe configuration or your hosting provider's recommended deployment setup for production builds.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the development server |
| `npm run build` | Create a production build |
| `npm test` | Run the test suite |
| `npm run eject` | Eject from Create React App |

## Application Routes

| Route | Description |
| --- | --- |
| `/search` | Search and browse Pokémon |
| `/pokemon/:id` | View detailed Pokémon information and TCG card-related actions |
| `/compare` | Compare the currently queued Pokémon |
| `/list` | Sign in, register, and manage saved Pokémon |
| `/tcgcards` | View and manage saved TCG cards |

Any unknown route redirects to `/pokemon/1`.

## Data Sources

- Pokémon data is loaded from the PokeAPI.
- TCG data is loaded from the TCGDex API.
- User data and saved collections are stored in Firebase Firestore.

The app retrieves Pokémon list data, detailed stats, moves, abilities, sprites, and evolution data from the PokeAPI and stores user-specific collection records in Firestore.

## Notes

- The app currently supports authenticated personal collections for both Pokémon and TCG cards.
- The My Pokémon and My TCG Cards screens include search, pagination, and collection management features.
- The project is structured as a Create React App app and is intended to be run locally with Firebase configured in the app.
