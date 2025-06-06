import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Immersive 3D Product Showcase',
    description: 'An interactive 3D product visualization using Three.js with configurable options and realistic lighting.',
    image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '3D Visualization',
    link: '#'
  },
  {
    title: 'Dynamic Data Dashboard',
    description: 'Real-time data visualization dashboard with animated charts and interactive filters.',
    image: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Data Visualization',
    link: '#'
  },
  {
    title: 'Interactive Music Experience',
    description: 'Audio-responsive visuals that react to music with particle systems and dynamic color changes.',
    image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Creative Coding',
    link: '#'
  },
  {
    title: 'E-Commerce 3D Product Viewer',
    description: 'Custom 3D product viewer allowing users to examine products from all angles with realistic materials.',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '3D Interaction',
    link: '#'
  }
];

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!projectsRef.current) return;
    
    const projectCards = projectsRef.current.querySelectorAll('.project-card');
    
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          scale: 1.02,
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const overlay = card.querySelector('.project-overlay');
        gsap.to(overlay, {
          opacity: 0.9,
          duration: 0.3
        });
        
        const content = card.querySelector('.project-content');
        gsap.to(content, {
          y: 0,
          opacity: 1,
          duration: 0.3
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const overlay = card.querySelector('.project-overlay');
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
        
        const content = card.querySelector('.project-content');
        gsap.to(content, {
          y: 20,
          opacity: 0,
          duration: 0.3
        });
      });
    });
  }, []);
  
  return (
    <section id="projects" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="projects-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="h-1 w-24 bg-purple-600 rounded-full mx-auto"></div>
          <p className="text-white/80 mt-6 max-w-2xl mx-auto">
            Explore my recent work showcasing interactive experiences
            and creative applications of web technologies.
          </p>
        </div>
        
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="project-card relative overflow-hidden rounded-xl cursor-pointer"
              data-cursor="link"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-80 object-cover"
                />
                <div className="project-overlay absolute inset-0 bg-gradient-to-t from-purple-900 to-blue-900 opacity-0 transition-opacity duration-300"></div>
                <div className="project-content absolute inset-0 flex flex-col justify-end p-8 text-white transform translate-y-20 opacity-0">
                  <span className="text-purple-300 text-sm font-medium mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-white/80 mb-4">{project.description}</p>
                  <a href={project.link} className="flex items-center text-purple-300 hover:text-white transition-colors">
                    View Project <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="parallax-section" data-depth="0.2">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </section>
  );
};

export default Projects;