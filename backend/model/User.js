import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: function () {
        return "USER-" + Date.now(); // Auto-generated ID
      }
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
