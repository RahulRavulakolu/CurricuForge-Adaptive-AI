import mongoose from "mongoose";

const AttainmentDataSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    academic_year: {
      type: String,
      required: true
    },

    batch: {
      type: String
    },

    student_count: {
      type: Number
    },

    marks_data: {
      type: [mongoose.Schema.Types.Mixed]
    },

    co_attainment: {
      type: mongoose.Schema.Types.Mixed
    },

    po_attainment: {
      type: mongoose.Schema.Types.Mixed
    },

    target_attainment: {
      type: Number,
      default: 60
    }
  },
  { timestamps: true }
);

export default mongoose.model("AttainmentData", AttainmentDataSchema);
