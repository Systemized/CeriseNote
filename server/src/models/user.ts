import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: String,
    name: String,
    email: String,
    createdAt: Date
})

const User = mongoose.model('User', userSchema);
export default User;