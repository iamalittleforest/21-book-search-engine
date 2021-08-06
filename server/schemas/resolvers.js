const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async () => {

    }
  },

  Mutation: {
    createUser: async () => {

    },
    login: async (parent, { email, password }) => {
      
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user associated with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async () => {

    },
    deleteBook: async () => {

    }
  },
};

module.exports = resolvers;