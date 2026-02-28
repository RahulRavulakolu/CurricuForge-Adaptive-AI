import jsPDF from 'jspdf';

export const exportQuestionPaperToPDF = (questionPaper) => {
  // Create new PDF document
  const doc = new jsPDF();

  // Set font
  doc.setFont('helvetica');

  // Add title
  doc.setFontSize(20);
  doc.text(questionPaper.paper_title, 105, 20, { align: 'center' });

  // Add course info
  doc.setFontSize(12);
  doc.text(`Course Code: ${questionPaper.course_code}`, 20, 35);
  doc.text(`Course Name: ${questionPaper.course_name}`, 20, 42);
  doc.text(`Duration: ${questionPaper.duration}`, 20, 49);
  doc.text(`Maximum Marks: ${questionPaper.max_marks}`, 20, 56);

  // Add instructions
  doc.setFontSize(14);
  doc.text('Instructions:', 20, 70);
  doc.setFontSize(10);
  questionPaper.instructions?.forEach((inst, i) => {
    doc.text(`${i + 1}. ${inst}`, 25, 77 + (i * 5));
  });

  let yPosition = 77 + (questionPaper.instructions?.length || 0) * 5 + 10;

  // Add sections
  questionPaper.sections?.forEach((section, sIdx) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Section title
    doc.setFontSize(14);
    doc.text(section.name, 20, yPosition);
    yPosition += 7;

    // Section instructions
    doc.setFontSize(10);
    doc.text(section.instructions, 25, yPosition);
    yPosition += 7;

    // Questions
    section.questions?.forEach((q, qIdx) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Question number and text
      doc.setFontSize(11);
      const questionText = `Q${q.number}. ${q.question}`;
      const lines = doc.splitTextToSize(questionText, 170);

      lines.forEach((line, lineIdx) => {
        doc.text(line, 25, yPosition + (lineIdx * 5));
      });

      yPosition += lines.length * 5 + 3;

      // Bloom's level and CO mapping
      doc.setFontSize(9);
      doc.text(`[Bloom's: ${q.blooms_level}] [${q.co_mapped}]`, 30, yPosition);
      yPosition += 8;
    });

    yPosition += 10;
  });

  // Add total marks
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(12);
  doc.text(`Total Marks: ${questionPaper.total_marks}`, 105, yPosition, { align: 'center' });

  // Save the PDF
  doc.save(`${questionPaper.course_code}_Question_Paper.pdf`);
};

export const exportCurriculumToPDF = (curriculum) => {
  const doc = new jsPDF();
  doc.setFont('helvetica');

  // Title
  doc.setFontSize(20);
  doc.text(curriculum.program_title, 105, 20, { align: 'center' });

  // Program details
  doc.setFontSize(12);
  doc.text(`Skill: ${curriculum.skill}`, 20, 35);
  doc.text(`Level: ${curriculum.level}`, 20, 42);
  doc.text(`Total Credits: ${curriculum.total_credits}`, 20, 49);

  let yPosition = 60;

  // Add semesters
  curriculum.semesters?.forEach((semester, sIdx) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Semester header
    doc.setFontSize(14);
    doc.text(`Semester ${semester.number}`, 20, yPosition);
    yPosition += 7;

    // Semester summary
    doc.setFontSize(10);
    doc.text(semester.summary, 25, yPosition);
    yPosition += 7;

    // Courses
    semester.courses?.forEach((course, cIdx) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.text(`${course.code} - ${course.name}`, 25, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.text(`Credits: ${course.credits} | Type: ${course.type}`, 30, yPosition);
      yPosition += 5;

      // Topics
      doc.text('Topics:', 30, yPosition);
      yPosition += 4;

      course.topics?.forEach((topic, tIdx) => {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${topic}`, 35, yPosition);
        yPosition += 4;
      });

      yPosition += 3;
    });

    yPosition += 10;
  });

  // Save the PDF
  doc.save(`${curriculum.skill.replace(/\s+/g, '_')}_Curriculum.pdf`);
};

export const exportCourseToPDF = (course) => {
  const doc = new jsPDF();
  doc.setFont('helvetica');

  // Title
  doc.setFontSize(22);
  doc.setTextColor(0, 163, 255); // A nice cyan-ish color
  doc.text(course.title, 105, 20, { align: 'center' });

  // Header Info
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Code: ${course.code} | Credits: ${course.credits} | Semester: ${course.semester}`, 105, 30, { align: 'center' });
  doc.text(`Program: ${course.program}`, 105, 37, { align: 'center' });

  let yPosition = 50;

  // Unit-wise Syllabus
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('UNIT-WISE SYLLABUS', 20, yPosition);
  yPosition += 10;

  course.units?.forEach((unit) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Unit ${unit.number}: ${unit.title} (Weeks ${unit.weeks})`, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 7;

    doc.setFontSize(11);
    unit.topics?.forEach((topic) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• Week ${topic.week}: ${topic.content}`, 25, yPosition);
      yPosition += 6;
    });
    yPosition += 5;
  });

  // Course Outcomes
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('COURSE OUTCOMES', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  course.course_outcomes?.forEach((co) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    const text = `${co.code}: ${co.description} (Level: ${co.blooms_level})`;
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, yPosition);
    yPosition += lines.length * 6 + 2;
  });

  // Assessment
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ASSESSMENT BLUEPRINT', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Internal: ${course.assessment?.internal?.marks} marks`, 20, yPosition);
  yPosition += 6;
  doc.text(`External: ${course.assessment?.external?.marks} marks (${course.assessment?.external?.type})`, 20, yPosition);
  yPosition += 6;
  doc.text(`Total Marks: ${course.assessment?.total}`, 20, yPosition);
  yPosition += 10;

  // References
  if (course.references && course.references.length > 0) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    yPosition += 5;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TEXTBOOKS & REFERENCES', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    course.references.forEach((ref, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${ref}`, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 6 + 2;
    });
  }

  // Save the PDF
  doc.save(`${course.code}_Syllabus.pdf`);
};

