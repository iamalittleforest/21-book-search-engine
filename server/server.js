// import dependencies
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

// import for GraphQL schema
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

// create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// set up Express app to use Apollo server features
server.applyMiddleware({ app });

// set up Express app to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if production, set up Express app to serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});