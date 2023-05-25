let { Schema, model } = require("mongoose");

let studentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  "1-1": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
  },
  "1-2": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
  },
  "2-1": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
  },
});

module.exports = {
  studentSchema,
};
