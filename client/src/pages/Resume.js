import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiLinkedin, FiMail, FiPhone, FiDownload, FiAward, FiTrendingUp, FiCode, FiDatabase, FiBriefcase, FiUsers, FiBook } from 'react-icons/fi';

const achievements = [
  { icon: FiTrendingUp, title: '$500K+ Monthly Recurring Revenue', description: 'Secured 50% more Fortune 500 clients at Red Ventures' },
  { icon: FiCode, title: '$900K Projected Annual Revenue Growth', description: 'Boosted funnel efficiency 150% through automation and AI' },
  { icon: FiAward, title: '3.95 GPA | 4.00 Major GPA', description: 'ACT 34 Superscore (99th percentile) | Dean\'s List 2023-2026' },
  { icon: FiDatabase, title: '30+ Hours Saved Weekly', description: 'Automated scheduling algorithms and business processes' },
];

function Resume() {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [achievementsRef, achievementsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [educationRef, educationInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <header className="min-h-[60vh] bg-black dark:bg-gray-900 flex items-center py-20">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-white mb-2">Scott (Daniel) Wait II</h1>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-gray-300 dark:text-gray-400">
            <a href="https://www.linkedin.com/in/danielwait2" target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-white transition-colors">
              www.linkedin.com/in/danielwait2
            </a>
            <span>|</span>
            <a href="tel:+19802509513" className="hover:text-white dark:hover:text-white transition-colors">
              (980) 250-9513
            </a>
            <span>|</span>
            <a href="mailto:danielwait1216@gmail.com" className="hover:text-white dark:hover:text-white transition-colors">
              danielwait1216@gmail.com
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://www.linkedin.com/in/danielwait2"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white font-semibold flex items-center space-x-2 hover:bg-white/20 transition-all border border-white/20"
            >
              <FiLinkedin />
              <span>LinkedIn</span>
            </motion.a>
            <motion.a
              href="mailto:danielwait1216@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white font-semibold flex items-center space-x-2 hover:bg-white/20 transition-all border border-white/20"
            >
              <FiMail />
              <span>Email</span>
            </motion.a>
            <motion.a
              href="tel:+19802509513"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white font-semibold flex items-center space-x-2 hover:bg-white/20 transition-all border border-white/20"
            >
              <FiPhone />
              <span>Call</span>
            </motion.a>
            <motion.a
              href="https://byu-my.sharepoint.com/:w:/g/personal/wait2_byu_edu/EUWZCsUK-p9KjOc1X0QGBkoByWfEruMDmnARUTYZxVpupQ?e=sIcjBs"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-black dark:bg-white dark:text-black rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <FiDownload />
              <span>Download Full Resume</span>
            </motion.a>
          </div>
        </motion.div>
      </header>

      <section className="py-20 bg-white dark:bg-gray-900">
        <motion.div
          ref={educationRef}
          initial={{ opacity: 0, y: 20 }}
          animate={educationInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">Professional Summary</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Product Manager and Technology Consultant with proven track record delivering revenue growth and operational efficiency. 
              Currently pursuing Master of Science in Information Systems Management at BYU Marriott School with 3.95 GPA. 
              Expert in product strategy, data analytics, automation, and cross-functional team leadership.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div ref={achievementsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
            className="text-4xl font-bold text-center mb-12 text-black dark:text-white"
          >
            Key Achievements
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="card-modern p-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-white dark:text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{achievement.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <motion.div
          ref={educationRef}
          initial={{ opacity: 0, y: 20 }}
          animate={educationInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white flex items-center justify-center gap-3">
            <FiBook />
            Education
          </h2>
          <div className="card-modern p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Brigham Young University — Marriott School of Business</h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-1">
                  <strong className="text-gray-900 dark:text-white">Master of Science Information Systems Management</strong>
                </p>
                <p className="text-gray-600 dark:text-gray-400">Provo, UT | Expected April 2027</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">GPA 3.95</strong> || <strong className="text-gray-900 dark:text-white">Major GPA 4.00</strong> || <strong className="text-gray-900 dark:text-white">ACT 34 Superscore (99th percentile)</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Academic Scholarship 2022-2026</strong> || <strong className="text-gray-900 dark:text-white">BYU Marriott School Dean's List 2023-2026</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Product Management Association</strong> || <strong className="text-gray-900 dark:text-white">Association for Information Systems</strong> - AI Governance Case Competition Finalist (2024)
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong className="text-gray-900 dark:text-white">Specialized Coursework:</strong> Product Management, SQL, Python, Tableau, Power BI, Generative AI, Advanced Excel, Data Wrangling, Data Analytics (pandas, NumPy, etc.), Machine Learning, Artificial Intelligence
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white">Certifications:</strong> Professional Scrum Master I, Certified Red Ventures Analyst
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={educationInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white flex items-center justify-center gap-3">
            <FiBriefcase />
            Experience
          </h2>
          <div className="space-y-8">
            {/* Red Ventures */}
            <div className="card-modern p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Red Ventures – Sage Home Loans</h3>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-1">Product Manager Intern</p>
                  <p className="text-gray-600 dark:text-gray-400">Charlotte, NC | Jun 2025 - Aug 2025</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Directed cross-functional agile teams to deliver customer experience improvements, securing <strong className="text-gray-900 dark:text-white">50% more Fortune 500 clients</strong> and generating <strong className="text-gray-900 dark:text-white">$500K+ in monthly recurring revenue</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Owned end-to-end lifecycle of application improvements, boosting funnel efficiency <strong className="text-gray-900 dark:text-white">150%</strong> and unlocking <strong className="text-gray-900 dark:text-white">$900K projected annual revenue growth</strong> through automation, artificial intelligence, and third-party API integration</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Led and automated tailored weekly reports to 30+ stakeholders, guiding strategic decisions concerning largest Fortune 500 client</span>
                </li>
              </ul>
            </div>

            {/* Wait Works LLC */}
            <div className="card-modern p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Wait Works LLC</h3>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-1">Founder/ Technology Consultant</p>
                  <p className="text-gray-600 dark:text-gray-400">Provo, UT | Aug 2024 - Present</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Automated booking systems and marketing flows, leading implementation team to cutting admin costs <strong className="text-gray-900 dark:text-white">35%</strong> and generating <strong className="text-gray-900 dark:text-white">$80K in off-peak revenue</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Delivered digital overhauls for 3 surgical centers, increasing online visibility <strong className="text-gray-900 dark:text-white">250%</strong> and reducing lost leads by <strong className="text-gray-900 dark:text-white">70%</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Implemented funnel analytics to identify where customers dropped off, then prioritized features like pre-filled, boosting adoption and saving staff <strong className="text-gray-900 dark:text-white">10+ hours/week</strong></span>
                </li>
              </ul>
            </div>

            {/* Missionary Training Center */}
            <div className="card-modern p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Missionary Training Center</h3>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-1">Product Manager</p>
                  <p className="text-gray-600 dark:text-gray-400">Provo, UT | Feb 2024 – Nov 2024</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Owned roadmap and execution for volunteer scheduling system (150+ daily schedules), leveraging SQL & Power Platform</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Planned and automated scheduling algorithms, saving <strong className="text-gray-900 dark:text-white">30+ hours per week</strong> and increasing operational efficiency</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Led a 5-person cross-functional team with Jira in agile cycles, delivering business operations improvements and advocating for stakeholder needs during daily scrums</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={educationInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white flex items-center justify-center gap-3">
            <FiUsers />
            Leadership & Service
          </h2>
          <div className="space-y-6">
            <div className="card-modern p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Association for Information Systems</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Junior Core Mentor | Provo, UT | September 2025 - Present</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mentored 4 Information System students through bi-weekly check-ins, offering guidance on projects, recruiting, and networking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Provided internship recruiting support that helped mentees secure interviews and build career readiness</span>
                </li>
              </ul>
            </div>

            <div className="card-modern p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">The Church of Jesus Christ of Latter-day Saints</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">Volunteer Representative – Spanish Speaker | Baltimore, MD | May 2021 - May 2023</p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Led 25+ volunteers and taught 100+ families from 21 counties self-reliance and English, driving community growth and service</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Delivered 1200+ theological and educational lessons in Spanish, strengthening leadership, stability, and self-sufficiency</span>
                </li>
              </ul>
            </div>

            <div className="card-modern p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Additional Leadership and Service</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Eagle Scout; Assistant Head Swim Coach; Ultimate Frisbee Team Captain, Just Serve Volunteer, Local Church Minister
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={educationInView ? { opacity: 1, y: 0 } : {}}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">Skills & Achievements</h2>
          <div className="card-modern p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Product Management</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Product strategy, roadmap & backlog ownership, KPIs, CX optimization, product discovery, GTM strategy, PSM 1
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Agile & Leadership</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Professional Scrum Master I, cross-functional team leadership, stakeholder engagement, Jira
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data & Analytics</h3>
              <p className="text-gray-700 dark:text-gray-300">
                SQL, Python (pandas, NumPy), Tableau, Power BI, Advanced Excel, product analytics, A/B testing, statistical modeling (XGBoost, Random Forest, seaborn)
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Technical Knowledge</h3>
              <p className="text-gray-700 dark:text-gray-300">
                APIs, cloud computing (AWS: EC2, RDS), ASP.NET Core MVC, C#, JavaScript, Microsoft Power Platform, HTML/CSS, VBA, Linux, Cursor, Personal Website: danielwait.com
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Personal</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Enjoy Formula 1 Racing, Ultimate Frisbee, Golf, and Hiking (Mt. Kilimanjaro, Grand Canyon)
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

export default Resume;
