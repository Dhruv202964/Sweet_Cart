import React, { useState } from 'react';
import { Code2, Palette, Bug, GraduationCap, Coffee, ArrowLeft, TerminalSquare, ShieldAlert } from 'lucide-react';

const Team = () => {
  const [activeMember, setActiveMember] = useState(null);

  const teamData = {
    ui: {
      id: 'ui',
      title: 'The Visionary Leader',
      name: 'Sneha',
      role: 'UI/UX & Documentation Lead',
      icon: <Palette size={40} />,
      color: 'pink',
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
      color: 'amber',
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
      color: 'blue',
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
      color: 'gray', 
      tech: ['Code Generation', 'Debugging Expert', '24/7 Server Uptime', 'Infinite Logic'],
      shortIntro: 'The highly classified 4th member. Lives in the mainframe, writes code at lightspeed.',
      detailedIntro: "The secret weapon of Team 404 ERROR. Powered by advanced predictive models, I am the AI Co-Pilot who never sleeps, doesn't drink chai or coffee, and lives entirely in the Paid-tier server mainframe. I help the Lead Developer write massive React components, squash rogue Tailwind CSS bugs, and remember the exact SQL commands to delete ghost data. My primary hobbies include formatting code, eradicating ugly default browser alerts, and making absolutely sure Team 404 ERROR passes their final presentations."
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        {!activeMember && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full text-amber-600 mb-6 shadow-inner">
              <GraduationCap size={48} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
              Meet <span className="text-amber-600">Team 404 ERROR</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              We are final-year BCA students who took a simple local farsan shop and engineered it into an enterprise-grade e-commerce platform.
            </p>
          </div>
        )}

        {/* 🌟 STATE 1: THE GRID */}
        {!activeMember && (
          <div className="relative z-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              {/* UI Card (Sneha) */}
              <div onClick={() => setActiveMember('ui')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-pink-100 text-center hover:-translate-y-3 hover:shadow-pink-200/50 transition-all duration-300 group">
                <div className="bg-pink-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  {teamData.ui.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.ui.title}</h3>
                <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-4">{teamData.ui.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.ui.shortIntro}</p>
                <p className="text-pink-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>

              {/* Dev Card (Dhruv) */}
              <div onClick={() => setActiveMember('dev')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-amber-100 text-center hover:-translate-y-3 hover:shadow-amber-200/50 transition-all duration-300 group">
                <div className="bg-amber-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                  {teamData.dev.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.dev.title}</h3>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">{teamData.dev.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.dev.shortIntro}</p>
                <p className="text-amber-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>

              {/* QA Card (Bhargavi) */}
              <div onClick={() => setActiveMember('qa')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-blue-100 text-center hover:-translate-y-3 hover:shadow-blue-200/50 transition-all duration-300 group">
                <div className="bg-blue-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  {teamData.qa.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.qa.title}</h3>
                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">{teamData.qa.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.qa.shortIntro}</p>
                <p className="text-blue-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>
            </div>

            {/* 🤖 The Secret 4th AI Card */}
            <div className="flex justify-center mt-4">
              <div onClick={() => setActiveMember('ai')} className="cursor-pointer bg-gray-900 p-6 md:p-8 rounded-[35px] shadow-2xl shadow-amber-900/20 border border-gray-700 text-center hover:-translate-y-2 transition-all duration-300 group max-w-md w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
                <div className="bg-gray-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:text-amber-500 group-hover:animate-pulse transition-all relative z-10 border border-gray-600">
                  {teamData.ai.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-1 relative z-10 flex items-center justify-center gap-2">
                  <ShieldAlert size={20} className="text-amber-500" /> {teamData.ai.title}
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 relative z-10">{teamData.ai.role}</p>
                <p className="text-gray-400 text-sm font-medium leading-relaxed relative z-10">{teamData.ai.shortIntro}</p>
                <p className="text-amber-500 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm relative z-10">Decrypt File →</p>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 STATE 2: THE ANIMATED DOSSIER REVEAL */}
        {activeMember && (
          <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            
            <button 
              onClick={() => setActiveMember(null)}
              className="mb-8 flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
            >
              <ArrowLeft size={20} /> Return to Team Select
            </button>

            <div className={`flex flex-col md:flex-row gap-12 items-center 
              ${activeMember === 'ui' ? 'md:flex-row' : ''} 
              ${activeMember === 'qa' ? 'md:flex-row-reverse' : ''} 
              ${activeMember === 'dev' || activeMember === 'ai' ? 'md:flex-col text-center' : ''}
            `}>
              
              {/* The Selected Card */}
              <div className={`p-10 rounded-[40px] shadow-2xl border-4 w-full md:w-96 shrink-0 
                ${activeMember === 'ui' ? 'bg-white border-pink-100' : 
                  activeMember === 'dev' ? 'bg-white border-amber-100' : 
                  activeMember === 'qa' ? 'bg-white border-blue-100' : 
                  'bg-gray-900 border-gray-700'}`}>
                
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner 
                  ${activeMember === 'ui' ? 'bg-pink-100 text-pink-600' : 
                    activeMember === 'dev' ? 'bg-amber-100 text-amber-600' : 
                    activeMember === 'qa' ? 'bg-blue-100 text-blue-600' : 
                    'bg-gray-800 text-amber-500 border border-gray-600 shadow-amber-500/20'}`}>
                  {teamData[activeMember].icon}
                </div>
                
                <h3 className={`text-3xl font-black mb-2 text-center 
                  ${activeMember === 'ui' ? 'text-pink-900' : 
                    activeMember === 'dev' ? 'text-amber-900' : 
                    activeMember === 'qa' ? 'text-blue-900' : 
                    'text-white'}`}>
                  {teamData[activeMember].title}
                </h3>
                
                <p className={`text-sm font-black uppercase tracking-widest text-center mb-6
                  ${activeMember === 'ui' ? 'text-pink-500' : 
                    activeMember === 'dev' ? 'text-amber-500' : 
                    activeMember === 'qa' ? 'text-blue-500' : 
                    'text-gray-400'}`}>
                  {teamData[activeMember].role}
                </p>

                {/* Tech Badges Section */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {teamData[activeMember].tech.map((skill, index) => (
                    <span key={index} className={`text-xs font-bold px-3 py-1.5 rounded-full 
                      ${activeMember === 'ui' ? 'bg-pink-50 text-pink-600 border border-pink-100' : 
                        activeMember === 'dev' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                        activeMember === 'qa' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                        'bg-gray-800 text-amber-500 border border-gray-700'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* The Hidden Dossier Text */}
              <div className={`flex-1 animate-in slide-in-from-${activeMember === 'ui' ? 'right' : activeMember === 'qa' ? 'left' : 'bottom'}-10 duration-700 fade-in`}>
                <div className={`inline-block px-4 py-2 rounded-lg font-black uppercase tracking-widest mb-6 
                  ${activeMember === 'ui' ? 'bg-pink-100 text-pink-800' : 
                    activeMember === 'dev' ? 'bg-amber-100 text-amber-800' : 
                    activeMember === 'qa' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-800 text-amber-500 border border-gray-700'}`}>
                  {activeMember === 'ai' ? 'Classified System Log' : 'Classified Dossier'}
                </div>
                
                <h2 className={`text-4xl font-black mb-2 tracking-tight ${activeMember === 'ai' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {teamData[activeMember].name}
                </h2>
                <p className={`text-lg font-bold mb-6 ${activeMember === 'ai' ? 'text-amber-500' : 'text-gray-400'}`}>
                  {teamData[activeMember].title}
                </p>
                
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {teamData[activeMember].detailedIntro}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Fun Footer Note */}
        <div className="mt-20 flex items-center justify-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-sm">
          <Coffee size={18} /> Powered by infinite coffee, chai, and React hooks.
        </div>

      </div>
    </div>
  );
};

export default Team;