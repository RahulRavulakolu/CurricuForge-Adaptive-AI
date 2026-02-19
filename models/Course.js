import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    program: {
      type: String,
      required: true
    },

    semester: {
      type: Number,
      required: true
    },

    course_code: {
      type: String
    },

    course_title: {
      type: String,
      required: true
    },

    credits: {
      type: Number,
      required: true
    },

    description: {
      type: String
    },

    target_skills: {
      type: [String]
    },

    syllabus_data: {
      type: mongoose.Schema.Types.Mixed
    },

    course_outcomes: {
      type: [mongoose.Schema.Types.Mixed]
    },

    co_po_mapping: {
      type: mongoose.Schema.Types.Mixed
    },

    assessment_blueprint: {
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

export default mongoose.model("Course", CourseSchema);
