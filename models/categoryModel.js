const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Provide name!'],
    maxlength: [30, 'Name must have less or equal then 20 characters']
  },

  kind: {
    type: String,
    required: [true, 'Provide kind!']
    // enum: ['room', 'experiences'],
    // default: 'room'
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
