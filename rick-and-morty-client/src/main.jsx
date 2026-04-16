// Entry point of the Rick and Morty React application.
// Sets up Apollo Client for GraphQL communication and React Router for navigation.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Configure Apollo Client to connect to the local GraphQL backend.
// InMemoryCache stores query results to avoid redundant network requests.
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

// Wrap the app with ApolloProvider to make the GraphQL client available
// to all components, and BrowserRouter to enable client-side routing.
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
)