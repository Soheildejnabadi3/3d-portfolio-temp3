import { useEffect, useRef } from 'react';

const skills = [
  { name: 'JavaScript/TypeScript', level: 90 },
  { name: 'React', level: 85 },
  { name: 'Three.js', level: 75 },
  { name: 'GSAP', level: 80 },
  { name: 'CSS/SCSS', level: 85 },
  { name: '3D Modeling', level: 65 },
  { name: 'UI/UX Design', level: 70 },
  { name: 'Node.js', level: 75 },
];

const About = () => {
  const skillsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!skillsRef.current) return;
    
    const skillBars = skillsRef.current.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar) => {
      const level = bar.getAttribute('data-level');
      (bar as HTMLElement).style.width = '0%';
      
      setTimeout(() => {
        (bar as HTMLElement).style.width = `${level}%`;
        (bar as HTMLElement).style.transition = 'width 1.5s cubic-bezier(0.41, 0.01, 0.2, 1)';
      }, 300);
    });
  }, []);
  
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="about-header mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h2>
            <div className="h-1 w-24 bg-purple-600 rounded-full"></div>
          </div>
          
          <div className="about-content text-white/90 text-lg mb-16">
            <p className="mb-6">
              I'm a creative developer specializing in building immersive web experiences 
              using cutting-edge technologies. With a background in both design and 
              development, I craft digital solutions that are both visually stunning 
              and technically excellent.
            </p>
            <p className="mb-6">
              My passion lies in the intersection of code and creativity, where I can 
              bring imaginative concepts to life through programming.
            </p>
            <div className="typing-text text-2xl text-purple-400 font-bold mb-6"></div>
          </div>
          
          <div className="about-skills" ref={skillsRef}>
            <h3 className="text-2xl font-bold text-white mb-8">Technical Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-purple-400">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className="skill-progress h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                      data-level={skill.level}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="parallax-section" data-depth="0.3">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default About;