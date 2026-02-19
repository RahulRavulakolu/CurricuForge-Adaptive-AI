import mongoose from "mongoose";

const CurriculumSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true
    },

    level: {
      type: String,
      enum: ["Diploma", "B.Tech", "Masters", "Certification"],
      required: true
    },

    semesters: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },

    weekly_hours: {
      type: String
    },

    industry_focus: {
      type: String
    },

    program_title: {
      type: String
    },

    curriculum_data: {
      type: mongoose.Schema.Types.Mixed
    },

    status: {
      type: String,
      enum: ["draft", "generated", "approved"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Curriculum", CurriculumSchema);
