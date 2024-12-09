export const jobs = [
  {
    id: "1",
    title: "Senior UX Designer",
    company: "Microsoft",
    location: "Washington",
    salary: "$50k-80k/month",
    type: "Full Time",
    experience: "5+ years",
    department: "Design",
    postedDate: "2 weeks ago",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    teamSize: "10-20 people",
    education: "Bachelor's degree",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    companyDescription: "Microsoft Corporation is an American multinational technology corporation headquartered in Redmond, Washington. Microsoft's best-known software products are the Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers.",
    description: `We are looking for a talented UX Designer to create amazing user experiences. The ideal candidate should have a keen eye for clean and artful design, possess superior UI knowledge, and be able to translate high-level requirements into interaction flows and artifacts.`,
    requirements: [
      "5+ years of UX design experience",
      "Strong portfolio of design projects",
      "Excellent problem-solving skills",
      "Experience with design tools (Figma, Sketch)",
      "Knowledge of HTML/CSS/JavaScript",
      "Bachelor's degree in Design or related field"
    ],
    responsibilities: [
      "Create user-centered designs by understanding business requirements",
      "Develop and conceptualize a comprehensive UI/UX design strategy",
      "Produce high-quality UX design solutions through wireframes",
      "Create original graphic designs",
      "Prepare and present rough drafts to internal teams",
      "Identify and troubleshoot UX problems",
      "Conduct layout adjustments based on user feedback"
    ],
    benefits: [
      "Competitive salary package",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Flexible working hours",
      "Remote work options",
      "Professional development",
      "Gym membership",
      "Annual bonus"
    ],
    skills: [
      "UI/UX Design",
      "Wireframing",
      "Prototyping",
      "User Research",
      "Figma",
      "Adobe XD",
      "Design Systems"
    ]
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Google",
    location: "Remote",
    salary: "$50k-60k/month",
    type: "Full Time",
    experience: "3+ years",
    department: "Design",
    postedDate: "1 week ago",
    employmentType: "Full-time",
    workplaceType: "Remote",
    teamSize: "5-10 people",
    education: "Bachelor's degree",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2880px-Google_2015_logo.svg.png",
    companyDescription: "Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.",
    description: `We are seeking a talented Product Designer to join our team and help shape the future of our products. The ideal candidate will have a passion for creating intuitive user experiences and a strong understanding of user-centered design principles.`,
    requirements: [
      "3+ years of product design experience",
      "Strong portfolio showcasing end-to-end design process",
      "Experience with design systems",
      "Proficiency in Figma and other design tools",
      "Understanding of user research methodologies",
      "Bachelor's degree in Design or related field"
    ],
    responsibilities: [
      "Design user-centered solutions for complex problems",
      "Create and maintain design systems",
      "Conduct user research and usability testing",
      "Collaborate with cross-functional teams",
      "Present design solutions to stakeholders",
      "Iterate on designs based on feedback",
      "Mentor junior designers"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health coverage",
      "401(k) with company match",
      "Unlimited PTO",
      "Remote work flexibility",
      "Learning and development budget",
      "Home office stipend",
      "Wellness programs"
    ],
    skills: [
      "Product Design",
      "User Research",
      "Design Systems",
      "Prototyping",
      "Figma",
      "User Testing",
      "Visual Design"
    ]
  },
  {
    id: "3",
    title: "Senior Frontend Developer",
    company: "Meta",
    location: "California",
    salary: "$70k-90k/month",
    type: "Full Time",
    experience: "5+ years",
    department: "Engineering",
    postedDate: "3 days ago",
    employmentType: "Full-time",
    workplaceType: "Hybrid",
    teamSize: "15-20 people",
    education: "Bachelor's degree",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
    companyDescription: "Meta Platforms, Inc., doing business as Meta, is a multinational technology conglomerate based in Menlo Park, California. The company owns and operates Facebook, Instagram, Threads, and WhatsApp, among other products and services.",
    description: `We are looking for a Senior Frontend Developer to join our team and help build the next generation of social experiences. The ideal candidate will have extensive experience with modern frontend frameworks and a passion for creating performant, accessible web applications.`,
    requirements: [
      "5+ years of frontend development experience",
      "Expert knowledge of React and modern JavaScript",
      "Experience with state management solutions",
      "Strong understanding of web performance",
      "Knowledge of accessibility standards",
      "Bachelor's degree in Computer Science or related field"
    ],
    responsibilities: [
      "Develop and maintain frontend applications",
      "Optimize application performance",
      "Implement responsive designs",
      "Write clean, maintainable code",
      "Mentor junior developers",
      "Collaborate with designers and backend teams",
      "Participate in code reviews"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health benefits",
      "401(k) matching",
      "Stock options",
      "Unlimited vacation",
      "Remote work options",
      "Professional development budget",
      "Wellness programs"
    ],
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML/CSS",
      "Redux",
      "Web Performance",
      "Accessibility"
    ]
  }
] as const

export type Job = (typeof jobs)[number]