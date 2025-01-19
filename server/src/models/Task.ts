import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITask extends Document {
    title: string;
    desc?: string;
    status: 'incomplete' | 'completed';
    userId: string;
    listId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const TaskSchema: Schema<ITask> = new Schema({
    title: { type: String, required: true },
    desc:  { type: String, required: false },
    status: { type: String, enum: ['incomplete', 'completed'], default: 'incomplete' },
    userId: { type: String, required: true },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: false },
    createdAt: { type: Date, default: Date.now }
});

const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);
export default Task;