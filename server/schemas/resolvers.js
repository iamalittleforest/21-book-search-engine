const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id });
        return user;
      }
      throw new AuthenticationError('Please log in');
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
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

    // add book to user 
    saveBook: async (parent, { book }, context) => {
      
      // user is logged in
      if (context.user) {
        
        // find and update user matching provided id
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: book },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        
        return user;
      }

      // user is not logged in
      throw new AuthenticationError('You need to be logged in!');
    },
    deleteBook: async () => {

    }
  },
};

module.exports = resolvers;