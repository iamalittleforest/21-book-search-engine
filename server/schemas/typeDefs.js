const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    _id: String
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type User {

  }

  type Auth {

  }

  type Query {

  }

  type Mutation {

  }
`;

module.exports = typeDefs;