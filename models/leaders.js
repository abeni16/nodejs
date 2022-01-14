const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);

const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const leaderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

var Leaders = mongoose.model("Leaders", leaderSchema);

module.exports = Leaders;
