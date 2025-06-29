import mongoose from "mongoose";
const User = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true }
  });
  
const UserModel = mongoose.model("User", User);

export default UserModel;
  