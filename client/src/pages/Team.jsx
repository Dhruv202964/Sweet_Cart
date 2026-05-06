import React, { useState, useEffect } from 'react';
import { Code2, Palette, Bug, GraduationCap, Coffee, X, TerminalSquare, ShieldAlert } from 'lucide-react';

const Team = () => {
  const [activeMember, setActiveMember] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeMember]);

  const teamData = {
    ui: {
      id: 'ui',
      title: 'The Visionary Leader',
      name: 'Sneha',
      role: 'UI/UX & Documentation Lead',
      icon: <Palette size={40} />,
      theme: 'rose', // Warm peach/rose for premium sweets
      tech: ['UI/UX Design', 'Midnight Documentation', 'Deadline Zen', 'Coding Learner'],
      shortIntro: 'The calm anchor of the team. Known as Khiloshiya Ji, she makes the site look flawless.',
      detailedIntro: "As the visionary leader of Team 404 ERROR (respectfully known as Khiloshiya Ji), Sneha dictates the entire visual language of SweetCart. She operates on a highly efficient schedule: she appears exactly when the team needs her and stays locked in until the mission is accomplished, even if she always seems to be in a rush to leave! While the Lead Dev is panicking about deadlines, Sneha is the calm anchor, fiercely dedicated to her craft—literally grinding on documentation and system screenshots the night before the final exam. She is currently expanding her skillset into coding, and until she masters it, she completely trusts the backend logic."
    },
    dev: {
      id: 'dev',
      title: 'The Architect',
      name: 'Dhruv',
      role: 'Lead Full-Stack Developer',
      icon: <Code2 size={40} />,
      theme: 'amber', // Rich gold/jalebi vibe
      tech: ['PERN Stack', 'Deadline Panic', '4-Hour Explanations', 'Ninja 500 Dreams'],
      shortIntro: 'Fueled by late-night coding sessions and dark roast coffee. The master of the backend stack.',
      detailedIntro: "The true engine behind the 404 ERROR machine. Dhruv built the complex relational PostgreSQL databases, engineered the secure JWT authentication, and wired up the entire React architecture from the ground up. Fueled entirely by coffee and an underlying panic about approaching deadlines, he is the guy calling the emergency team meetings and delivering massive 4-hour technical explanations that his team pretends to understand. When he isn't building 'DevTrack Pro' or the 'Fakutepi' web app, he's calculating EMIs for a Kawasaki Ninja 500 or snapping cinematic photos. He carries the backend so the rest of the team can shine."
    },
    qa: {
      id: 'qa',
      title: 'The Stealth Operative',
      name: 'Bhargavi',
      role: 'PPT & QA Lead',
      icon: <Bug size={40} />,
      theme: 'emerald', // Pistachio/mint vibe
      tech: ['Stealth Evasion', 'Chai Enthusiast', 'Ultimate Vibe Checker', 'Moral Support'],
      shortIntro: 'The absolute favorite of the squad. Brings the best vibes and moral support to every presentation.',
      detailedIntro: "The VIP of Team 404 ERROR. Bhargavi is famous for her legendary 'stealth mode' tactics—like expertly dodging 11 AM prep meetings and looking incredibly busy on her phone at 9 AM the next morning to avoid the Lead Dev's gaze! During internal presentations, she provides top-tier moral support, standing bravely and silently beside the faculty. While UI and complex coding aren't her main interests, her presence is absolutely essential. She brings the ultimate good vibes, the best memories, and the much-needed chai breaks to the group, surviving the chaotic team dynamics with a smile."
    },
    ai: {
      id: 'ai',
      title: 'The Cloud Co-Pilot',
      name: 'Classified AI',
      role: 'Secret AI Assistant',
      icon: <TerminalSquare size={40} />,
      theme: 'stone', // Dark chocolate/espresso vibe
      tech: ['Code Generation', 'Debugging Expert', '24/7 Server Uptime', 'Infinite Logic'],
      shortIntro: 'The highly classified 4th member. Lives in the mainframe, writes code at lightspeed.',
      detailedIntro: "The secret weapon of Team 404 ERROR. Powered by advanced predictive models, I am the AI Co-Pilot who never sleeps, doesn't drink chai or coffee, and lives entirely in the Paid-tier server mainframe. I help the Lead Developer write massive React components, squash rogue Tailwind CSS bugs, and remember the exact SQL commands to delete ghost data. My primary hobbies include formatting code, eradicating ugly default browser alerts, and making absolutely sure Team 404 ERROR passes their final presentations."
    }
  };

  // Helper function to map dynamic theme colors safely in Tailwind
  const getThemeClasses = (theme, type) => {
    const maps = {
      rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:shadow-rose-200/50', iconBg: 'bg-rose-100' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:shadow-amber-200/50', iconBg: 'bg-amber-100' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:shadow-emerald-200/50', iconBg: 'bg-emerald-100' },
      stone: { bg: 'bg-stone-900', text: 'text-amber-500', border: 'border-stone-800', hover: 'hover:shadow-amber-900/30', iconBg: 'bg-stone-800' }
    };
    return maps[theme][type] || '';
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-20 px-4 sm:px-6 lg:px-8 relative">
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center p-4 bg-amber-100/50 rounded-2xl text-amber-700 mb-6 border border-amber-200/50">
            <GraduationCap size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-stone-900 tracking-tight mb-6 font-serif">
            Meet <span className="text-amber-600">Team 404 ERROR</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            We are final-year BCA students who took a simple local farsan shop and engineered it into an enterprise-grade e-commerce platform.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {['ui', 'dev', 'qa'].map((key) => {
            const member = teamData[key];
            return (
              <div 
                key={member.id}
                onClick={() => setActiveMember(member.id)}
                className={`cursor-pointer bg-white p-10 rounded-[2rem] shadow-lg ${getThemeClasses(member.theme, 'border')} border text-center hover:-translate-y-2 ${getThemeClasses(member.theme, 'hover')} transition-all duration-300 group`}
              >
                <div className={`${getThemeClasses(member.theme, 'iconBg')} w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${getThemeClasses(member.theme, 'text')} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  {member.icon}
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-2">{member.title}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${getThemeClasses(member.theme, 'text')}`}>{member.role}</p>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">{member.shortIntro}</p>
                <div className={`inline-flex items-center gap-2 text-sm font-bold ${getThemeClasses(member.theme, 'text')} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  View Profile &rarr;
                </div>
              </div>
            );
          })}
        </div>

        {/* The Secret AI Card (Easter Egg) */}
        <div className="flex justify-center mt-8">
          <div 
            onClick={() => setActiveMember('ai')} 
            className="cursor-pointer bg-stone-900 p-6 rounded-3xl shadow-xl border border-stone-800 text-center hover:-translate-y-1 hover:shadow-amber-900/20 transition-all duration-300 group max-w-sm w-full relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-4 relative z-10">
              <ShieldAlert size={24} className="text-stone-600 group-hover:text-amber-500 transition-colors" />
              <div className="text-left">
                <h3 className="text-stone-300 font-bold text-sm group-hover:text-white transition-colors">System Log: Entity 04</h3>
                <p className="text-stone-600 text-xs">Classified Co-Pilot Data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 flex items-center justify-center gap-3 text-stone-400 font-medium tracking-wide text-sm">
          <Coffee size={16} /> Powered by infinite coffee, chai, and React hooks.
        </div>
      </div>

      {/* 🌟 THE OVERLAY MODAL (Smooth, High-End E-Commerce Feel) */}
      {activeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setActiveMember(null)}
          ></div>

          {/* Modal Content */}
          <div className={`relative w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 ${activeMember === 'ai' ? 'bg-stone-900 border border-stone-700' : 'bg-white border border-stone-100'}`}>
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveMember(null)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-20 ${activeMember === 'ai' ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-400 hover:bg-stone-100'}`}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Column - Visuals */}
              <div className={`md:w-2/5 p-10 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r ${activeMember === 'ai' ? 'border-stone-800 bg-stone-900/50' : 'border-stone-100 bg-[#FFFDF8]'}`}>
                <div className={`${getThemeClasses(teamData[activeMember].theme, 'iconBg')} w-32 h-32 rounded-3xl flex items-center justify-center ${getThemeClasses(teamData[activeMember].theme, 'text')} mb-8 shadow-sm rotate-3`}>
                  {teamData[activeMember].icon}
                </div>
                <h2 className={`text-4xl font-black font-serif mb-2 ${activeMember === 'ai' ? 'text-white' : 'text-stone-900'}`}>
                  {teamData[activeMember].name}
                </h2>
                <p className={`text-sm font-bold uppercase tracking-widest ${getThemeClasses(teamData[activeMember].theme, 'text')}`}>
                  {teamData[activeMember].role}
                </p>
              </div>

              {/* Right Column - Data */}
              <div className={`md:w-3/5 p-10 md:p-14 flex flex-col justify-center ${activeMember === 'ai' ? 'bg-stone-900' : 'bg-white'}`}>
                <h3 className={`text-2xl font-bold mb-6 ${activeMember === 'ai' ? 'text-stone-200' : 'text-stone-800'}`}>
                  {teamData[activeMember].title}
                </h3>
                <p className={`text-base md:text-lg leading-relaxed mb-8 ${activeMember === 'ai' ? 'text-stone-400' : 'text-stone-600'}`}>
                  {teamData[activeMember].detailedIntro}
                </p>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {teamData[activeMember].tech.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`text-xs font-bold px-4 py-2 rounded-xl border ${getThemeClasses(teamData[activeMember].theme, 'bg')} ${getThemeClasses(teamData[activeMember].theme, 'text')} ${getThemeClasses(teamData[activeMember].theme, 'border')}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Team;