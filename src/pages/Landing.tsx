// src/pages/Landing.tsx
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Container from '../components/Container';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Container size="lg">
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>✨</span>
              <span>Your Career Journey Starts Here</span>
            </div>
            <h1 className={styles.title}>
              Track Your Job Applications
              <span className={styles.titleGradient}> Like a Pro</span>
            </h1>
            <p className={styles.description}>
              Stay organized and in control of your job search. Monitor application statuses, 
              manage deadlines, and never miss an opportunity with our powerful tracking system.
            </p>
            <div className={styles.buttons}>
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Free Forever</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>⚡</div>
                <div className={styles.statLabel}>Lightning Fast</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>🔒</div>
                <div className={styles.statLabel}>Secure & Private</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <Container>
          <h2 className={styles.featuresTitle}>Everything You Need to Land Your Dream Job</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconPurple}`}>
                📊
              </div>
              <h3 className={styles.featureTitle}>Track Applications</h3>
              <p className={styles.featureDescription}>
                Keep all your job applications organized in one place. Never lose track of where you've applied.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconBlue}`}>
                📈
              </div>
              <h3 className={styles.featureTitle}>Monitor Progress</h3>
              <p className={styles.featureDescription}>
                Track your application status from submission to interview to offer. Stay on top of every opportunity.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconPink}`}>
                📅
              </div>
              <h3 className={styles.featureTitle}>Manage Deadlines</h3>
              <p className={styles.featureDescription}>
                Set reminders and track important dates. Never miss a follow-up or interview again.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconGreen}`}>
                📝
              </div>
              <h3 className={styles.featureTitle}>Store Details</h3>
              <p className={styles.featureDescription}>
                Save job descriptions, requirements, and contact information for quick reference.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconOrange}`}>
                🔍
              </div>
              <h3 className={styles.featureTitle}>Search & Filter</h3>
              <p className={styles.featureDescription}>
                Quickly find any application with powerful search and filtering capabilities.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${styles.iconTeal}`}>
                📱
              </div>
              <h3 className={styles.featureTitle}>Mobile Friendly</h3>
              <p className={styles.featureDescription}>
                Access your applications anywhere, anytime. Fully responsive design for all devices.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <Container>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Take Control of Your Job Search?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of job seekers who are staying organized and landing their dream jobs.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg">
                Start Tracking Today
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Landing;