import { useEffect, useRef, useState } from "react";
import "./MyLearning.css";

// Connect this shape to your API/store when learning tracking is available.
// Keeping the initial state empty avoids presenting sample data as a student's progress.
const initialLearningData = {
  courses: [],
  activity: [],
  weeklyGoal: { targetMinutes: 0, completedMinutes: 0 },
  achievements: [],
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function useVisible(ref, threshold = 0.18) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return visible;
}

function CountUp({ value, visible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || !value) return;
    const start = performance.now();
    const duration = 650;
    let frame;
    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);

  return count;
}

function EmptyNote({ children }) {
  return <p className="learning-empty-note">{children}</p>;
}

function MyLearning() {
  const [learningData] = useState(initialLearningData);
  const overviewRef = useRef(null);
  const progressRef = useRef(null);
  const activityRef = useRef(null);
  const coursesRef = useRef(null);
  const overviewVisible = useVisible(overviewRef);
  const progressVisible = useVisible(progressRef);
  const activityVisible = useVisible(activityRef);
  const coursesVisible = useVisible(coursesRef);

  const courses = learningData.courses;
  const lessonsCompleted = courses.reduce((sum, course) => sum + (course.lessonsCompleted || 0), 0);
  const totalLessons = courses.reduce((sum, course) => sum + (course.totalLessons || 0), 0);
  const quizzesCompleted = courses.reduce((sum, course) => sum + (course.quizzesCompleted || 0), 0);
  const practiceSolved = courses.reduce((sum, course) => sum + (course.practiceSolved || 0), 0);
  const overallProgress = totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
  const hours = Math.floor(courses.reduce((sum, course) => sum + (course.minutesStudied || 0), 0) / 60);
  const completedCourses = courses.filter((course) => course.progress === 100).length;
  const inProgress = courses.filter((course) => course.progress > 0 && course.progress < 100).slice(0, 3);
  const activityAvailable = learningData.activity.some((minutes) => minutes > 0);
  const goalPercent = learningData.weeklyGoal.targetMinutes
    ? Math.min(100, Math.round((learningData.weeklyGoal.completedMinutes / learningData.weeklyGoal.targetMinutes) * 100))
    : 0;
  const ringStyle = { "--progress": progressVisible ? overallProgress : 0 };

  return (
    <section className="learning-page" id="my-learning">
      <header className="learning-hero" ref={overviewRef}>
        <div className={`learning-hero-copy reveal ${overviewVisible ? "is-visible" : ""}`}>
          <span className="learning-label">LEARNING</span>
          <h1>Your learning,<br />at a glance.</h1>
          <p>Keep track of what you’ve started, what you’ve completed, and where to go next.</p>
        </div>
        <div className={`learning-stats reveal ${overviewVisible ? "is-visible" : ""}`}>
          <div className="learning-stat"><span>Courses enrolled</span><strong><CountUp value={courses.length} visible={overviewVisible} /></strong></div>
          <div className="learning-stat"><span>Courses completed</span><strong><CountUp value={completedCourses} visible={overviewVisible} /></strong></div>
          <div className="learning-stat"><span>Learning hours</span><strong><CountUp value={hours} visible={overviewVisible} /></strong></div>
          <div className="learning-stat"><span>Current streak</span><strong><CountUp value={0} visible={overviewVisible} /><em> days</em></strong></div>
        </div>
      </header>

      <div className="learning-top-grid">
        <section className="learning-block continue-block">
          <div className="block-heading"><span>01 / NEXT UP</span><h2>Continue where you left off</h2></div>
          {inProgress.length ? <div className="continue-list">
            {inProgress.map((course, index) => <article className="continue-course" key={course.id} style={{ "--delay": `${index * 90}ms` }}>
              <div><h3>{course.name}</h3><p>{course.progress}% complete <i /> {course.lessonsCompleted} / {course.totalLessons} lessons</p></div>
              <div className="course-progress"><span style={{ width: `${course.progress}%` }} /></div>
              <button type="button">Continue <b>→</b></button>
            </article>)}
          </div> : <EmptyNote>When you start a course, you’ll be able to pick up right where you left off.</EmptyNote>}
        </section>

        <section className="learning-block progress-block" ref={progressRef}>
          <div className="block-heading"><span>02 / OVERVIEW</span><h2>Your progress</h2></div>
          <div className="progress-layout">
            <div className="progress-ring" style={ringStyle}><div><strong>{overallProgress}%</strong><span>overall</span></div></div>
            <dl className="progress-details">
              <div><dt>Lessons completed</dt><dd>{lessonsCompleted}</dd></div>
              <div><dt>Quizzes completed</dt><dd>{quizzesCompleted}</dd></div>
              <div><dt>Practice questions solved</dt><dd>{practiceSolved}</dd></div>
            </dl>
          </div>
        </section>
      </div>

      <div className="learning-middle-grid">
        <section className="learning-block activity-block" ref={activityRef}>
          <div className="block-heading"><span>03 / THIS WEEK</span><h2>Learning activity</h2></div>
          {activityAvailable ? <div className={`activity-chart ${activityVisible ? "chart-visible" : ""}`}>{dayLabels.map((day, index) => <div className="activity-day" key={day}><div className="activity-bar"><span style={{ "--height": `${Math.min(100, learningData.activity[index] || 0)}%` }} /></div><small>{day}</small></div>)}</div> : <EmptyNote>Your study time for the last seven days will appear here once you begin learning.</EmptyNote>}
        </section>

        <section className="learning-block goal-block">
          <div className="block-heading"><span>04 / WEEKLY RHYTHM</span><h2>This week’s goal</h2></div>
          {learningData.weeklyGoal.targetMinutes ? <div className="goal-content"><strong>{Math.floor(learningData.weeklyGoal.completedMinutes / 60)} / {Math.floor(learningData.weeklyGoal.targetMinutes / 60)} <small>hours</small></strong><div className="goal-progress"><span style={{ width: `${goalPercent}%` }} /></div><p>{Math.max(0, Math.ceil((learningData.weeklyGoal.targetMinutes - learningData.weeklyGoal.completedMinutes) / 60))} hours remaining</p></div> : <EmptyNote>Set a weekly learning goal to keep a gentle rhythm with your studies.</EmptyNote>}
        </section>
      </div>

      <section className="learning-block courses-block" ref={coursesRef}>
        <div className="block-heading"><span>05 / YOUR LIBRARY</span><h2>My courses</h2></div>
        {courses.length ? <div className={`course-table ${coursesVisible ? "table-visible" : ""}`}>{courses.map((course, index) => <article className="course-row" key={course.id} style={{ "--row-delay": `${index * 80}ms` }}><h3>{course.name}</h3><span className="course-percent">{course.progress}%</span><div className="row-progress"><span style={{ width: `${course.progress}%` }} /></div><span className={`course-status ${course.progress === 100 ? "done" : ""}`}>{course.progress === 100 ? "Completed ✓" : "In progress"}</span><button type="button">{course.progress === 100 ? "Review" : "Continue"} <b>→</b></button></article>)}</div> : <EmptyNote>Your enrolled courses will live here. Explore a topic whenever you’re ready to begin.</EmptyNote>}
      </section>

      <section className="learning-block achievements-block">
        <div className="block-heading"><span>06 / MILESTONES</span><h2>Achievements</h2></div>
        <div className="achievement-list">
          {["First Lesson", "First Quiz", "5 Lessons Completed", "7 Day Streak", "First Course Completed"].map((title) => {
            const earned = learningData.achievements.includes(title);
            return <div className={`achievement ${earned ? "earned" : "locked"}`} key={title}><span aria-hidden="true">{earned ? "✦" : "○"}</span><p>{title}<small>{earned ? "Achieved" : "Not yet"}</small></p></div>;
          })}
        </div>
      </section>
    </section>
  );
}

export default MyLearning;
