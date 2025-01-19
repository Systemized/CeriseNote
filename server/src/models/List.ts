import mongoose, { Document, Schema, Model } from "mongoose";

export interface IList extends Document {
    name: string;
    userId: string;
    createdAt: Date;
}

const ListSchema: Schema<IList> = new Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const List: Model<IList> = mongoose.model<IList>('List', ListSchema);
export default List;
