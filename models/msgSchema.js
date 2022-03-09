const mongoose= require('mongoose');

// user Schema Or ocument Structure
const msgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    }
    
})
// Create model
const Message= new mongoose.model("MESSAGE",msgSchema);
module.exports=Message;