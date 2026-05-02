import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';

export default function News() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <main className="max-w-2xl mx-auto px-6 lg:px-8 py-20 text-center space-y-8">
          
          {/* Coming Soon Section */}
          <section className="flex flex-col items-center gap-8">
            <div className="space-y-6">
              {/* Decorative elements */}
              <div className="flex justify-center gap-2 text-3xl text-[#ff4b86]">
                <span>✨</span>
                <span>✨</span>
                <span>✨</span>
              </div>
              
              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tight leading-[1.1]">
                Coming Soon
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 font-light tracking-wide">
                Something exciting is brewing
              </p>
              
              {/* Description */}
              <div className="pt-6 space-y-4">
                <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed max-w-xl mx-auto">
                  We're crafting amazing stories and exclusive content just for you. Stay tuned for inspiring fashion, beauty, and lifestyle insights from the world of Spark Stage.
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="pt-8 flex justify-center">
                <Link 
                  to="/on-stage" 
                  className="bg-black text-white px-10 py-3 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#ff4b86] transition-colors duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-200"
                >
                  EXPLORE NOW
                </Link>
              </div>
              
              {/* Decorative elements bottom */}
              <div className="flex justify-center gap-2 pt-8 text-3xl text-[#ff4b86]">
                <span>✨</span>
                <span>✨</span>
                <span>✨</span>
              </div>
            </div>
          </section>

        </main>

        {/* Footer Bar */}
        <div className="bg-black text-white py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest uppercase gap-4 text-center md:text-left">
          <span>ALL THE RIGHTS RESERVED</span>
          <span>© 2023 CONDÉ NAST</span>
        </div>
      </div>
    </PageTransition>
  );
}
