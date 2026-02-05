import Link from 'next/link';

export const metadata = {
  title: 'About Us | Education for Equality',
  description: 'Learn about our mission to provide free quality education to underprivileged children in Nigeria.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--secondary)] to-[var(--accent)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--primary-darker)] mb-4">
            About Education for Equality
          </h1>
          <p className="text-lg text-[var(--text-muted)]">
            Empowering underprivileged children in Nigeria through accessible, quality education.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-[var(--text-muted)] mb-6">
              Education for Equality is an initiative that aims to increase the accessibility of free,
              quality education to children in Nigeria, and by extension, children across Africa,
              so that they have the opportunity to attain an excellent quality of life and standard of living.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">The Problem</h2>
            <p className="text-[var(--text-muted)] mb-4">
              Nigeria faces a significant educational crisis. According to UNICEF:
            </p>
            <ul className="space-y-2 text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span><strong>20 million children</strong> ages 5-14 are out of school in Nigeria</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span>Nigeria has the <strong>highest number of out-of-school children</strong> in the world</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span>Many families cannot afford school fees, uniforms, or learning materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span>Rural areas often lack access to qualified teachers and proper school facilities</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Our Solution</h2>
            <p className="text-[var(--text-muted)] mb-6">
              We believe technology can help bridge the education gap. Our online learning platform provides:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <div className="w-12 h-12 bg-[var(--primary-dark)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Curriculum</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Complete K-12 curriculum covering Math, English, Science, and Social Studies at no cost.
                </p>
              </div>

              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <div className="w-12 h-12 bg-[var(--primary-dark)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Lessons</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Engaging video content that makes learning accessible even without a teacher present.
                </p>
              </div>

              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <div className="w-12 h-12 bg-[var(--primary-dark)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mobile Accessible</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Works on any device - phone, tablet, or computer - to reach students wherever they are.
                </p>
              </div>

              <div className="bg-[var(--secondary)] rounded-xl p-6">
                <div className="w-12 h-12 bg-[var(--primary-dark)] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Students can track their learning progress and pick up where they left off.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-12">Get Involved</h2>
            <p className="text-[var(--text-muted)] mb-6">
              We're always looking for partners who share our vision. Whether you're a school,
              government organization, NGO, or individual supporter, there are many ways to help:
            </p>
            <ul className="space-y-2 text-[var(--text-muted)] mb-8">
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span><strong>Donate</strong> - Help us expand our content and reach more students</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span><strong>Partner</strong> - Schools and organizations can integrate our platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary-dark)] mt-1">•</span>
                <span><strong>Volunteer</strong> - Help create content or support our operations</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="https://naomiivie04.wixsite.com/mysite/support-us"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center"
            >
              Donate Now
            </a>
            <a
              href="mailto:info@educationforequality.org"
              className="btn-secondary text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect With Us</h2>
          <p className="text-[var(--text-muted)] mb-4">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-[var(--text-muted)]">
            <a href="mailto:info@educationforequality.org" className="hover:text-[var(--primary-dark)]">
              info@educationforequality.org
            </a>
            <span className="hidden sm:inline">|</span>
            <span>+1 (667) 415 5712</span>
          </div>
        </div>
      </section>
    </div>
  );
}
