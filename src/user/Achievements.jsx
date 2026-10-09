
import {
  Trophy,
  Lock,
  Check,
  Star,
  BookOpen,
  Target,
} from "lucide-react";
import "./Achievements.css";

function Achievements() {
  // Temporary data for UI testing.
  // Later this will come from the PHP/MySQL backend.
  const achievements = [
    {
      id: 1,
      title: "First Step",
      description: "Start your learning journey.",
      icon: Star,
    },
    {
      id: 2,
      title: "Getting Started",
      description: "Complete your first learning activity.",
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Keep Going",
      description: "Build your learning consistency.",
      icon: Target,
    },
    {
      id: 4,
      title: "Learning Habit",
      description: "Stay consistent with your learning.",
      icon: Trophy,
    },
    {
      id: 5,
      title: "Knowledge Builder",
      description: "Make meaningful progress.",
      icon: Trophy,
    },
    {
      id: 6,
      title: "Focused Learner",
      description: "Keep improving your skills.",
      icon: Trophy,
    },
    {
      id: 7,
      title: "Growing Strong",
      description: "Continue your learning journey.",
      icon: Trophy,
    },
  ];

  // Temporary current achievement.
  // Later this will come from the backend.
  const currentAchievement = 3;

  // Show every previous achievement + current + next 2.
  const visibleAchievements = achievements.filter(
    (achievement) => achievement.id <= currentAchievement + 2
  );

  return (
    <div className="achievements-page">
      <div className="achievements-container">

        {/* HEADER */}
        <div className="achievements-header">
          <div>
            <span className="achievements-label">YOUR JOURNEY</span>
            <h1>Achievements</h1>
            <p>
              Keep moving forward and unlock new milestones along the way.
            </p>
          </div>

          <div className="achievement-count">
            <Trophy size={18} />
            <span>
              {currentAchievement} completed
            </span>
          </div>
        </div>

        {/* ROADMAP */}
        <section className="achievement-roadmap">

          <div className="roadmap-line"></div>
<div className="roadmap-path">
  <svg
    viewBox="0 0 1000 875"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="
        M 500 40
        C 500 90, 720 110, 720 175
        C 720 250, 280 270, 280 350
        C 280 430, 720 450, 720 525
        C 720 600, 280 625, 280 700
        C 280 770, 500 800, 500 850
      "
    />
  </svg>
</div>
          {visibleAchievements.map((achievement) => {
            const Icon = achievement.icon;

            const isCompleted =
              achievement.id < currentAchievement;

            const isCurrent =
              achievement.id === currentAchievement;

            const isUpcoming =
              achievement.id > currentAchievement;

            return (
              <div
                key={achievement.id}
                className={`roadmap-item ${
                  achievement.id % 2 === 0
                    ? "roadmap-right"
                    : "roadmap-left"
                } ${
                  isCompleted
                    ? "completed"
                    : isCurrent
                    ? "current"
                    : "upcoming"
                }`}
              >

                {/* ACHIEVEMENT */}
                <div className="achievement-node">

                  <div className="achievement-dot">

                    {isCompleted ? (
                      <Check size={20} strokeWidth={2.5} />
                    ) : isUpcoming ? (
                      <Lock size={17} />
                    ) : (
                      <Icon size={21} />
                    )}

                  </div>

                  <div className="achievement-info">

                    <span className="achievement-number">
                      ACHIEVEMENT {achievement.id}
                    </span>

                    <h2>{achievement.title}</h2>

                    <p>{achievement.description}</p>

                    {isCurrent && (
                      <span className="current-label">
                        CURRENT MILESTONE
                      </span>
                    )}

                    {isCompleted && (
                      <span className="completed-label">
                        COMPLETED
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="locked-label">
                        UPCOMING
                      </span>
                    )}

                  </div>
                </div>

              </div>
            );
          })}

        </section>

      </div>
    </div>
  );
}

export default Achievements;

