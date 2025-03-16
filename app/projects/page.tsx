import { ProjectCard } from "@/components/project-card"

export default function Projects() {
  const imgGen = "https://dummyimage.com/600X192/1f2023/f9f2ed.png&text="
  const projects = [
    {
      id: 1,
      title: "Attendance System Using OpenCV",
      description: "A Python-based attendance system that utilizes facial recognition to accurately identify students and mark their attendance on specific dates.",
      image: `${imgGen}Attendance System Using OpenCV`, // Replace with the actual image path
      technologies: ["Python", "OpenCV", "Face Recognition", "pandas", "Tkinter"],
      github: "https://github.com/Amank-root/attendance_sys_using_opencv",
      demo: "https://github.com/Amank-root/attendance_sys_using_opencv", // Provide a link to a live demo if available
    },
    {
      id: 2,
      title: "MooMovies - Streaming Platform",
      description: "Your one-stop destination for streaming movies, anime, and manga across Bollywood, Hollywood, and other genres.",
      image: `${imgGen}MooMovies - Streaming Platform`, // Replace with the actual image path
      technologies: ["Nextjs", "TypeScript", "Tailwind CSS", "TheMovieDB API"],
      github: "https://moomoviev2.pages.dev/",
      demo: "https://moomoviev2.pages.dev/",
    },
    {
      id: 3,
      title: "Titanic Survival Prediction",
      description: "Developed a machine learning model to predict Titanic passenger survival using data preprocessing, exploratory data analysis, and classification algorithms.",
      image: `${imgGen}Titanic Survival Prediction`, // Replace with the actual image path
      technologies: ["Python", "pandas", "NumPy", "Scikit-learn", "Matplotlib"],
      github: "https://www.kaggle.com/code/amankroot/trying-titanic-dataset",
      demo: "https://www.kaggle.com/code/amankroot/trying-titanic-dataset"
    },
    
  ]

  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="mb-6 text-2xl font-bold text-primary">Projects</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

