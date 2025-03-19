import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false }, // Message seen status
    timestamp: { type: Date, default: Date.now }, // Message sent time
});

export default mongoose.model('Message', messageSchema);
