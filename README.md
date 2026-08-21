# Raelee's Pokedex

A responsive React and TypeScript Pokedex application powered by [PokeAPI](https://pokeapi.co/) and Firebase.

## Features

- Browse Pokemon fetched from PokeAPI
- Search Pokemon by name with case-insensitive partial matching
- Choose 10, 25, 50, or 100 Pokemon per page
- Add Pokemon to a personal collection
- Remove Pokemon from a personal collection
- Register and sign in with Firebase Authentication
- Store each user's collection in Cloud Firestore
- Responsive layout for desktop and mobile screens

## Tech Stack

- React 19
- TypeScript
- React Router
- Firebase Authentication and Cloud Firestore
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

Pokemon documents are associated with the signed-in user's Firebase UID through the `user` field. Configure Firestore security rules so users can only read and modify their own documents.

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
| `/` | Browse available Pokemon |
| `/login` | Sign in to an account |
| `/register` | Create an account |
| `/collection` | View the signed-in user's Pokemon collection |

## Data Source

Pokemon data is loaded from the PokeAPI. The app fetches the Pokemon list and individual Pokemon details, including names, types, abilities, and front sprites.
