const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
      me: async (parent, args, context) => {
        if(context.user) {
          const userInfo = await User.findOne({
            $or: [{ _id: user ? user._id : params.id },
                  { username: params.username }]
          });
          // if NO userInfo...
          if (!userInfo) {
            return res.status(400).json({ message: "No user found." });
          }
          return userInfo;
        }
      }
    },

    Mutation: {

      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        console.log(token, user);
        return  { token, user };
      },

      login: async (parent, {email, password}) => {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "No user found." });
        }
    
        const correctPw = await user.isCorrectPassword(password);
    
        if (!correctPw) {
          return res.status(400).json({ message: 'Incorrect password!' });
        }
        const token = signToken(user);
        return ({ token, user });
      },

      saveBook: async (parent, args, context) => {
        if (context.user) {
          let updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args } },
            { new: true }
          );
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
          return res.status(404).json({ message: "No user found!" });
        }
      }
    } 
}
    
module.exports = resolvers;