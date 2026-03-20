// Google Apps Script for Classroom Upload Notifications
// Setup: 1. Go to script.google.com 2. Paste this 3. classroom.google.com → Triggers → Add → onCourseWorkCreate

function onCourseWorkCreate(e) {
  const courseWork = e.courseWork;
  const course = e.course;
  
  // Class ID from your learning-path.html: ODUxMTY4MzkwMDAw
  const CLASS_ID = 'ODUxMTY4MzkwMDAw'; // Replace if different
  
  if (course.id !== CLASS_ID) return; // Only this class
  
  const title = courseWork.title || 'مادة جديدة';
  const message = `📢 تحديث جديد في الفصل!\n\n"${title}"\n\nتفقد الدرس الآن! 🚀`;
  
  // Get all students
  const students = Classroom.Courses.CourseMembers.list(course.id).members.filter(m => m.profile.role === 'STUDENT');
  
  students.forEach(student => {
    try {
      GmailApp.sendEmail(student.profile.emailAddress, 'تحديث جديد في فصل سيد عثمان', message, {
        htmlBody: message.replace(/\\n/g, '<br>')
      });
    } catch (error) {
      console.log(`Failed to notify ${student.profile.emailAddress}: ${error}`);
    }
  });
  
  console.log(`Notified ${students.length} students for "${title}"`);
}

// Test function
function testNotification() {
  const testEvent = {
    courseWork: { title: 'اختبار إشعار' },
    course: { id: 'ODUxMTY4MzkwMDAw' }
  };
  onCourseWorkCreate(testEvent);
}

// Deploy Instructions:
// 1. script.google.com → New project → Paste code
// 2. Save → classroom.google.com → Class → Settings → Apps Script → Edit
// 3. Triggers → Add → Choose `onCourseWorkCreate` → Run
// Works automatically on upload!

