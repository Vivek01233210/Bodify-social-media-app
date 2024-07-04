import mongoose from "mongoose";

const profanityFilterSchema = new mongoose.Schema({
  bannedWords: [String],
});

const ProfanityFilter = mongoose.model("ProfanityFilter", profanityFilterSchema);

export default ProfanityFilter;