import mongoose from 'mongoose';

// Define the User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
  },
  password: {
    type: String,
    required: true
  },
  avatar:{
    type:String,
    default:"https://tse4.mm.bing.net/th?id=OIP.rcVoa74ACEOZ2YdpJavLXgHaHa&pid=Api&P=0&h=180",
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the User Model
const UserModel = mongoose.model('User', UserSchema); // Model name should be capitalized

export default UserModel;
