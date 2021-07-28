const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

    Query: {
      me: async (parent, args, context) => {
        if(context.user) {
          const foundUser = await User.findOne({
            $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
          });
      
          if (!foundUser) {
            return res.status(400).json({ message: 'Cannot find a user with this id!' });
          }
          return foundUser;
        }
      }
    },

    Mutation: {
      addUser: async (parent, args) => {
        console.log("in add user", args)
        const user = await User.create(args);
        const token = signToken(user);
        console.log(token, user);
        return  { token, user };
      },
      login: async (parent, {email, password}) => {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "Can't find this user" });
        }
    
        const correctPw = await user.isCorrectPassword(password);
    
        if (!correctPw) {
          return res.status(400).json({ message: 'Wrong password!' });
        }
        const token = signToken(user);
        return ({ token, user });
      },
      saveBook: async (parent, args, context) => {
        console.log(context)
        console.log("here is the book id", args)
        if (context.user) {
          console.log("here is the user", context.user)
          let updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args } },
            { new: true }
          );
          console.log("updated User", updatedUser)
          return updatedUser;
        }
      },
      removeBook: async (parent, args, context) => {
        let updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "Couldn't find user with this id!" });
        }
      }
    } 
}
    
module.exports = resolvers;