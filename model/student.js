let { Schema, model } = require("mongoose");

let studentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  total_credits: Number,
  total_points: Number,
  total_backlogs: [String],
  total_backlogs_cnt: Number,
  name: {
    fname: String,
    sname: String,
    lname: String,
  },
  password: {
    type: String,
  },
  photo: {
    type: String,
  },
  "1-1": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
  "1-2": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
  "2-1": {
    subjects: Schema.Types.Mixed,
    labs: Schema.Types.Mixed,
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
});

module.exports = {
  studentSchema,
};
