let { Schema, model } = require("mongoose");

let analysisSchema = new Schema({
  total_credits: Number,
  total_points: Number,
  total_backlogs: [String],
  total_backlogs_cnt: Number,
  "1-1": {
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
  "1-2": {
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
  "2-1": {
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
  "2-2": {
    points: Number,
    backlogs: [String],
    backlogs_cnt: Number,
  },
});

module.exports = {
  analysisSchema,
};
