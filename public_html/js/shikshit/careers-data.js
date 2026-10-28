/**
 * Shikshit Careers Data & Content Configuration
 * Centralized content source for the Career page:
 * - openPositions: array of active job openings (drives avatar mood & openings list)
 * - speechMessages: rotating dialogue for the student avatar in calm vs excited moods
 * - whyWorkWithUs: culture value pillars
 * - hiringProcess: timeline steps
 * - faqs: frequently asked questions
 */
window.SHIKSHIT_CAREERS_CONFIG = {
  // Configured job openings. Set to [] for 0 openings (calm mood).
  // Populate with objects to trigger excited mood and display active role cards.
  openPositions: [],

  // Rotating Avatar Speech Messages (rotated every 4-5s with smooth fade)
  speechMessages: {
    calm: [
      "No openings today, check back soon!",
      "Learning never stops\u00A0📚",
      "Want to volunteer? We'd love your support!\u00A0💜",
      "Big changes start with small steps\u00A0✨",
      "Books don't read themselves\u00A0🎒"
    ],
    excited: [
      "We're hiring! Come join us\u00A0🎉",
      "New openings are live! Check them out!\u00A0🚀",
      "Be a mentor, inspire a child\u00A0🌟",
      "Help us transform education across India!\u00A0📐",
      "Big dreams start with passionate educators!\u00A0✨"
    ],
    loading: [
      "Checking for openings..."
    ]
  },

  // "Why work with Shikshit" Value Cards
  whyWorkWithUs: [
    {
      id: 'mentorship',
      title: 'Student Mentorship',
      description: 'Empower children from underserved communities through personalized guidance, interactive workshops, and positive role modeling.',
      icon: 'mentorship'
    },
    {
      id: 'equity',
      title: 'Educational Equity',
      description: 'Tackle systemic divides by bringing localized, vernacular, high-quality STEM and foundational learning to schools that need it most.',
      icon: 'equity'
    },
    {
      id: 'community',
      title: 'Community Impact',
      description: 'Collaborate with grassroots partners, local educators, and families to create sustainable, community-rooted educational change.',
      icon: 'community'
    },
    {
      id: 'growth',
      title: 'Growth & Learning',
      description: 'Develop your leadership, curriculum, and operational skills in an agile, supportive environment that invests in your future.',
      icon: 'growth'
    }
  ],

  // "How we hire" Timeline Steps
  hiringProcess: [
    {
      step: 1,
      title: 'Apply',
      description: 'Submit your profile or expression of interest in 2 minutes via email or our form.'
    },
    {
      step: 2,
      title: 'Conversation',
      description: 'An informal introductory chat about your values, background, and teaching philosophy.'
    },
    {
      step: 3,
      title: 'Meet the Team',
      description: 'Collaborate on a lightweight curriculum prompt and meet fellow educators and mentors.'
    },
    {
      step: 4,
      title: 'Join Us',
      description: 'Receive an offer and step into an empowering culture shaping the future of education.'
    }
  ],

  // FAQ Accordion
  faqs: [
    {
      q: 'Do you accept volunteers and interns?',
      a: 'Yes! We actively welcome volunteers and interns across teaching, digital curriculum design, community drives, and event mentorship. Reach out via our Become a Member page or email us anytime.'
    },
    {
      q: 'Can I submit my resume even if there are no open positions right now?',
      a: 'Absolutely. We maintain a talent directory of passionate educators and coordinators. When new positions open, we review existing submissions first. Send your CV to shikshiteducation@gmail.com.'
    },
    {
      q: 'How will I hear about new openings?',
      a: 'New openings are posted live on this page, shared directly with our email notification subscribers above, and announced on our official community channels.'
    }
  ]
};

// Sample openings preset for testing or demonstration
window.SHIKSHIT_SAMPLE_OPENINGS = [
  {
    id: 'lead-stem-educator',
    title: 'Lead STEM Educator',
    type: 'Full-Time',
    tagClass: 'tag-purple',
    location: 'Jaipur / Lucknow • On-site',
    description: 'Deliver interactive science and math modules to primary & middle school students in underserved areas.',
    perk: 'Non-Profit Band',
    applyEmail: 'shikshiteducation@gmail.com'
  },
  {
    id: 'curriculum-specialist',
    title: 'Curriculum & Content Specialist',
    type: 'Hybrid',
    tagClass: 'tag-pink',
    location: 'Delhi NCR • Hybrid',
    description: 'Design bilingual vernacular worksheets, teacher guides, and creative STEM kits.',
    perk: 'Non-Profit Band',
    applyEmail: 'shikshiteducation@gmail.com'
  },
  {
    id: 'outreach-coordinator',
    title: 'Student Outreach Coordinator',
    type: 'Remote',
    tagClass: 'tag-amber',
    location: 'All India • Remote',
    description: 'Manage volunteer recruitment, partner school relationships, and scholarship campaigns.',
    perk: 'Non-Profit Band',
    applyEmail: 'shikshiteducation@gmail.com'
  }
];
