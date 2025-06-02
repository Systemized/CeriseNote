import mongoose from 'mongoose';
const { Schema } = mongoose;

const noteSchema = new Schema({
    // _id: String,
    user_id: String,
    title: String,
    content: String,
})

const Note = mongoose.model('Note', noteSchema);
export default Note;