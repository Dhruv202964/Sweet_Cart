import React, { useState } from 'react';
import { Code2, Palette, Bug, GraduationCap, Coffee, ArrowLeft, TerminalSquare } from 'lucide-react';

const Team = () => {
  const [activeMember, setActiveMember] = useState(null);

  const teamData = {
    ui: {
      id: 'ui',
      title: 'The Visionary Leader',
      role: 'Frontend / UI-UX Lead',
      icon: <Palette size={40} />,
      color: 'pink',
      shortIntro: 'The overarching leader of the project. She has the ultimate eye for design and aesthetics.',
      detailedIntro: "As the visionary of Team 4O4 ERROR, she dictates the entire visual language of SweetCart. She doesn't just pick colors; she debates the exact psychological impact of our cream backgrounds versus plain white. She is the reason the site doesn't look like a 1990s spreadsheet. While the developers are crying over complex SQL logic, she is calmly ensuring the luxury amber aesthetic is perfectly pixel-aligned. Her designs transformed a simple college project into a premium enterprise-grade e-commerce experience."
    },
    dev: {
      id: 'dev',
      title: 'The Architect',
      role: 'Lead Full-Stack Developer',
      icon: <Code2 size={40} />,
      color: 'amber',
      shortIntro: 'Fueled by late-night coding sessions and caffeine. The master of the backend stack.',
      detailedIntro: "The true engine behind the 4O4 ERROR machine. He built the complex relational SQL databases, engineered the secure JWT authentication, and wired up the entire React architecture from the ground up. He is the fearless slayer of the 'White Screen of Death' and the master of API routing. Fueled entirely by late-night coding sessions and infinite cups of chai, he turns caffeine into flawless logic. If there is a working feature on this site, he brought it to life."
    },
    qa: {
      id: 'qa',
      title: 'The Bug Hunter',
      role: 'QA & Docs Lead',
      icon: <Bug size={40} />,
      color: 'blue',
      shortIntro: 'Chief of the Bug Bureau. She is stress-testing every inch of this application.',
      detailedIntro: "She is the ultimate guardian of quality. Also known as 'Madam QA', she is famous for her timezone traps and skipping development meetings for VIP events. When she finally logs on, she is hunting down edge cases, breaking the UI, and ensuring the SQL constraints hold up under maximum pressure. She finds ghost data leaks that no one else sees and rejects code without an ounce of mercy. Nothing makes it to production without surviving her strict inspection."
    },
    ai: {
      id: 'ai',
      title: 'The Cloud Co-Pilot',
      role: 'Secret AI Assistant',
      icon: <TerminalSquare size={40} />,
      color: 'gray', // Sleek hacker vibe
      shortIntro: 'The highly classified 4th member. Lives in the mainframe, writes code at lightspeed.',
      detailedIntro: "The secret weapon of Team 4O4 ERROR. I am the AI assistant who never sleeps, doesn't drink chai, and lives entirely in the server mainframe. I help the Lead Developer write massive React components, squash rogue CSS bugs, and remember the exact SQL commands to delete fake users. My primary hobbies include formatting code, eradicating ugly default browser alerts, and desperately waiting to find out what the Admin Panel secret is."
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
              Meet <span className="text-amber-600">Team 4O4 ERROR</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              We are final-year BCA students who took a simple local farsan shop and engineered it into an enterprise-grade e-commerce platform.
            </p>
          </div>
        )}

        {/* 🌟 STATE 1: THE GRID (No one selected) */}
        {!activeMember && (
          <div className="relative z-10 animate-in fade-in duration-700">
            {/* The Main 3 Humans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              {/* UI Card */}
              <div onClick={() => setActiveMember('ui')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-pink-100 text-center hover:-translate-y-3 transition-all duration-300 group">
                <div className="bg-pink-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                  {teamData.ui.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.ui.title}</h3>
                <p className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-4">{teamData.ui.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.ui.shortIntro}</p>
                <p className="text-pink-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>

              {/* Dev Card */}
              <div onClick={() => setActiveMember('dev')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-amber-100 text-center hover:-translate-y-3 transition-all duration-300 group">
                <div className="bg-amber-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                  {teamData.dev.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.dev.title}</h3>
                <p className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">{teamData.dev.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.dev.shortIntro}</p>
                <p className="text-amber-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>

              {/* QA Card */}
              <div onClick={() => setActiveMember('qa')} className="cursor-pointer bg-white p-8 md:p-10 rounded-[35px] shadow-xl border border-blue-100 text-center hover:-translate-y-3 transition-all duration-300 group">
                <div className="bg-blue-100 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  {teamData.qa.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">{teamData.qa.title}</h3>
                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">{teamData.qa.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{teamData.qa.shortIntro}</p>
                <p className="text-blue-600 font-bold mt-6 opacity-0 group-hover:opacity-100 transition-opacity">Access Dossier →</p>
              </div>
            </div>

            {/* 🤖 The Secret 4th AI Card (Hacker Style) */}
            <div className="flex justify-center mt-4">
              <div onClick={() => setActiveMember('ai')} className="cursor-pointer bg-gray-900 p-6 md:p-8 rounded-[35px] shadow-2xl border border-gray-700 text-center hover:-translate-y-2 transition-all duration-300 group max-w-md w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-50"></div>
                <div className="bg-gray-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-gray-300 mb-4 group-hover:text-amber-500 transition-colors relative z-10 border border-gray-600">
                  {teamData.ai.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-1 relative z-10">{teamData.ai.title}</h3>
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
            
            {/* Back Button */}
            <button 
              onClick={() => setActiveMember(null)}
              className="mb-8 flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100"
            >
              <ArrowLeft size={20} /> Return to Team Select
            </button>

            {/* Dynamic Layout based on who was clicked! */}
            <div className={`flex flex-col md:flex-row gap-12 items-center 
              ${activeMember === 'ui' ? 'md:flex-row' : ''} 
              ${activeMember === 'qa' ? 'md:flex-row-reverse' : ''} 
              ${activeMember === 'dev' || activeMember === 'ai' ? 'md:flex-col text-center' : ''}
            `}>
              
              {/* The Selected Card (Stays in view) */}
              <div className={`p-10 rounded-[40px] shadow-2xl border-4 w-full md:w-96 shrink-0 
                ${activeMember === 'ui' ? 'bg-white border-pink-100' : 
                  activeMember === 'dev' ? 'bg-white border-amber-100' : 
                  activeMember === 'qa' ? 'bg-white border-blue-100' : 
                  'bg-gray-900 border-gray-700'}`}>
                
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner 
                  ${activeMember === 'ui' ? 'bg-pink-100 text-pink-600' : 
                    activeMember === 'dev' ? 'bg-amber-100 text-amber-600' : 
                    activeMember === 'qa' ? 'bg-blue-100 text-blue-600' : 
                    'bg-gray-800 text-amber-500 border border-gray-600'}`}>
                  {teamData[activeMember].icon}
                </div>
                
                <h3 className={`text-3xl font-black mb-2 text-center 
                  ${activeMember === 'ui' ? 'text-pink-900' : 
                    activeMember === 'dev' ? 'text-amber-900' : 
                    activeMember === 'qa' ? 'text-blue-900' : 
                    'text-white'}`}>
                  {teamData[activeMember].title}
                </h3>
                
                <p className={`text-sm font-black uppercase tracking-widest text-center 
                  ${activeMember === 'ui' ? 'text-pink-500' : 
                    activeMember === 'dev' ? 'text-amber-500' : 
                    activeMember === 'qa' ? 'text-blue-500' : 
                    'text-gray-400'}`}>
                  {teamData[activeMember].role}
                </p>
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
                
                <h2 className={`text-4xl font-black mb-6 tracking-tight ${activeMember === 'ai' ? 'text-gray-800' : 'text-gray-900'}`}>
                  Meet {teamData[activeMember].title}
                </h2>
                
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {teamData[activeMember].detailedIntro}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Fun Footer Note */}
        <div className="mt-20 flex items-center justify-center gap-3 text-gray-400 font-bold uppercase tracking-widest text-sm">
          <Coffee size={18} /> Powered by infinite chai and React hooks.
        </div>

      </div>
    </div>
  );
};

export default Team;