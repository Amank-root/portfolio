import { client } from './lib/client'

// Sample data for testing
const sampleData = {
  // About data
  about: {
    _id: 'about',
    _type: 'about',
    title: 'About Me',
    bio: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            marks: [],
            text: "I'm a passionate Full Stack Developer currently pursuing B.Tech in Computer Science and Engineering. I love creating efficient, scalable, and user-friendly solutions using modern web technologies.",
          },
        ],
      },
    ],
    experiences: [
      {
        title: 'Full Stack Developer',
        company: 'Freelance',
        startDate: '2023-01-01',
        current: true,
        description: 'Developing web applications using React, Node.js, and MongoDB',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Technology in Data Science',
        institution: 'MDU, Rohtak',
        startDate: '2023-01-01',
        endDate: '2027-01-01',
        current: true,
        description: 'Currently pursuing B.Tech with focus on data science and web development',
      },
    ],
    interests: [
      { name: 'Coding', icon: 'Code' },
      { name: 'Gaming', icon: 'Gamepad2' },
      { name: 'Music', icon: 'Music' },
    ],
  },

  // Contact data
  contact: {
    _id: 'contact',
    _type: 'contact',
    title: 'Get In Touch',
    description:
      'Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form below or via my contact information.',
    email: 'amank.root@gmail.com',
    phone: '+91 9876543210',
    location: 'New Delhi, India',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/Amank-root', icon: 'Github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/amank-root', icon: 'Linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com/amank_root', icon: 'Twitter' },
    ],
  },

  // Sample tags
  tags: [
    { _type: 'tag', name: 'React', category: 'framework', color: 'blue' },
    { _type: 'tag', name: 'TypeScript', category: 'language', color: 'blue' },
    { _type: 'tag', name: 'Node.js', category: 'framework', color: 'green' },
    { _type: 'tag', name: 'Next.js', category: 'framework', color: 'gray' },
    { _type: 'tag', name: 'MongoDB', category: 'database', color: 'green' },
    { _type: 'tag', name: 'Tailwind CSS', category: 'framework', color: 'blue' },
    { _type: 'tag', name: 'Python', category: 'language', color: 'yellow' },
    { _type: 'tag', name: 'Express.js', category: 'framework', color: 'gray' },
  ],

  // Sample skills
  skills: [
    {
      _type: 'skill',
      title: 'Frontend Development',
      description: 'Creating responsive and interactive user interfaces',
      category: 'frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
      icon: 'Code',
      order: 1,
    },
    {
      _type: 'skill',
      title: 'Backend Development',
      description: 'Building robust server-side applications and APIs',
      category: 'backend',
      skills: ['Node.js', 'Express.js', 'Python', 'MongoDB', 'PostgreSQL', 'REST APIs'],
      icon: 'Server',
      order: 2,
    },
    {
      _type: 'skill',
      title: 'Development Tools',
      description: 'Tools and technologies for efficient development',
      category: 'tools',
      skills: ['Git', 'VS Code', 'Docker', 'AWS', 'Vercel', 'Figma'],
      icon: 'Wrench',
      order: 3,
    },
  ],
}

// Function to create sample data
export async function createSampleData() {
  try {
    console.log('Creating sample data...')

    // Create tags first (as they are referenced by projects)
    for (const tag of sampleData.tags) {
      await client.createIfNotExists({
        ...tag,
        _id: `tag-${tag.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        slug: { current: tag.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      })
    }

    // Create skills
    for (const skill of sampleData.skills) {
      await client.createIfNotExists({
        ...skill,
        _id: `skill-${skill.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      })
    }

    // Create about
    await client.createIfNotExists(sampleData.about)

    // Create contact
    await client.createIfNotExists(sampleData.contact)

    console.log('Sample data created successfully!')
  } catch (error) {
    console.error('Error creating sample data:', error)
  }
}

// Uncomment the line below to run the script
// createSampleData()
