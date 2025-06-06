import { Github as GitHub, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-white py-12 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Portfolio</span>
            </div>
            <p className="text-white/60 mt-2">Creating immersive digital experiences</p>
          </div>
          
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="GitHub"
                data-cursor="link"
              >
                <GitHub size={20} />
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="Twitter"
                data-cursor="link"
              >
                <Twitter size={20} />
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="LinkedIn"
                data-cursor="link"
              >
                <Linkedin size={20} />
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-white/70 hover:text-purple-400 transition-colors"
                aria-label="Instagram"
                data-cursor="link"
              >
                <Instagram size={20} />
              </a>
            </li>
          </ul>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} | All rights reserved
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors" data-cursor="link">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors" data-cursor="link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;