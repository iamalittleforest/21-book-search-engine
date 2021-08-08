// import dependencies
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    // get logged in user info
    me: async (parent, args, context) => {

      // user is logged in
      if (context.user) {

        // find a user matching logged in user id and return user
        const user = await User.findOne({ _id: context.user._id });
        return user;
      }

      // user is not logged in
      throw new AuthenticationError('Please log in');
    },
  },

  Mutation: {

    // create user using provided info
    createUser: async (parent, { username, email, password }) => {

      // create user using provided username, email, and password
      const user = await User.create({ username, email, password });

      // create token from user and return both
      const token = signToken(user);
      return { token, user };
    },

    // login using provided info
    login: async (parent, { email, password }) => {

      // find a user matching provided email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user associated with this email address');
      }

      // check if password is correct
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      // create token from user and return both
      const token = signToken(user);
      return { token, user };
    },

    // add book to user 
    saveBook: async (parent, { book }, context) => {

      // user is logged in
      if (context.user) {

        // find and update user matching logged in user id
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
        
        // return updated user
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