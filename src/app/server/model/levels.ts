import mongoose, { Schema, model, SchemaTypes } from 'mongoose';
import handleSaveError from '../helpers/handleSaveError';

const levelsMongooseSchema = new Schema(
  {
    userEmail: {
      type: SchemaTypes.String,
      required: [true, 'No user identifier/email'],
    },
    levels: {
      type: SchemaTypes.String,
      ref: 'levels',
      required: [true, 'Levels must be an array of user levels, might be an empty array'],
    },
  },
  { versionKey: false, timestamps: false }
);

// the post method is a Mongoose middleware (or hook) that runs after a specific operation — in this case, the save operation
// levelsMongooseSchema.post('save', handleSaveError);

const Levels = mongoose.models.levels || model('levels', levelsMongooseSchema);

export default Levels;
