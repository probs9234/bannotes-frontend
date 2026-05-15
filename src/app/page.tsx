'use client';

import { useState, useEffect } from 'react';
import { Search, Moon, FileText, ChevronDown, CheckCircle2, Download, PlayCircle, BookOpen, HelpCircle, WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bannotes-backend.onrender.com';
    fetch(`${apiUrl}/api/materials`)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(() => {});
  }, []);

  const notes = materials.filter(m => m.category === 'notes');
  const mockTests = materials.filter(m => m.category === 'mock-test');
  const pastPapers = materials.filter(m => m.category === 'past-paper');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold italic text-xl shadow-lg shadow-indigo-500/20">B</div>
          <span className="text-xl font-bold tracking-tight">Ban<span className="text-indigo-400">Notes</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#" className="hover:text-indigo-400 transition">Classes</a>
          <a href="#" className="hover:text-indigo-400 transition">Subjects</a>
          <a href="#" className="hover:text-indigo-400 transition">Tests</a>
          <a href="#" className="hover:text-indigo-400 transition">Past Papers</a>
          <a href="#" className="hover:text-indigo-400 transition">Toppers</a>
          <a href="#" className="hover:text-indigo-400 transition">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-indigo-400 transition"><Search className="w-5 h-5" /></button>
          <button className="text-indigo-400 hover:text-indigo-300 transition"><Moon className="w-5 h-5 fill-current" /></button>
          <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 text-sm font-bold text-slate-200 hover:bg-white/5 transition">
            Login
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 pt-16 pb-24 relative">
        
        {/* Background glow effects */}
        <div className="absolute top-10 left-0 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] z-0" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] z-0" />

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
              Study Smarter<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">with BanNotes</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
              Download chapter-wise notes, tests, PDFs, short notes & past papers for every class — all in one place.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                Explore Notes <span className="text-xl leading-none">&rarr;</span>
              </button>
              <button className="px-8 py-3.5 rounded-xl border border-white/20 text-slate-200 font-bold hover:border-indigo-400 hover:bg-indigo-500/10 transition flex items-center gap-2">
                Start Learning <span className="text-xl leading-none">&rarr;</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0f172a] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-400">Loved by <span className="text-indigo-400">1M+ Students</span></p>
            </div>
          </div>

          <div className="lg:w-1/2 relative h-[500px] w-full flex justify-end">
            <img src="/hero_boy.png" alt="3D Student" className="h-full object-contain drop-shadow-2xl z-10" />
          </div>
        </div>

        {/* Search Bar - The Camouflage Gateway */}
        <form 
          className="bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex items-center gap-2 mb-16 border border-white/10 mx-auto max-w-5xl relative z-10"
          onSubmit={(e) => {
            e.preventDefault();
            const partner = (e.currentTarget.elements.namedItem('partner') as HTMLInputElement).value;
            if (partner.trim()) {
              localStorage.setItem('partner', partner.trim());
              window.location.href = '/login';
            }
          }}
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              name="partner"
              placeholder="Search Class 10 Science Chapter 3, Maths notes..."
              className="w-full bg-transparent outline-none text-slate-200 font-medium placeholder:text-slate-500"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-white/10 text-slate-400 font-medium">
            Select Class <ChevronDown className="w-4 h-4" />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-white/10 text-slate-400 font-medium">
            Select Subject <ChevronDown className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 border-l border-white/10 text-slate-400 font-medium">
            All Resources <ChevronDown className="w-4 h-4" />
          </div>
          <button type="submit" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            Search <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Browse by Class */}
        <div className="mb-16 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Browse by Class</h3>
            <a href="#" className="text-sm font-bold text-indigo-400 hover:text-indigo-300">View All &rarr;</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[6,7,8,9,10,11,12].map((cls, idx) => {
              const colors = ['bg-green-500/10 text-green-400', 'bg-orange-500/10 text-orange-400', 'bg-blue-500/10 text-blue-400', 'bg-purple-500/10 text-purple-400', 'bg-indigo-500/10 text-indigo-400', 'bg-pink-500/10 text-pink-400', 'bg-teal-500/10 text-teal-400'];
              return (
                <div key={cls} className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[idx % colors.length]}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-bold whitespace-nowrap text-slate-200">Class {cls}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
          
          {/* Trending Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Trending Notes</h3>
              <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</a>
            </div>
            <div className="space-y-3">
              {(notes.length > 0 ? notes.slice(0,4) : [
                { title: 'Chapter 3: Motion & Time', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Science • Class 10', size: '2.4 MB' },
                { title: 'The Human Eye and Colourful World', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Science • Class 10', size: '1.8 MB' },
                { title: 'Linear Equations in Two Variables', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Maths • Class 9', size: '1.6 MB' },
                { title: 'Life Processes', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Biology • Class 10', size: '2.1 MB' },
              ]).map((item: any, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-slate-800 transition group">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-200 text-sm group-hover:text-indigo-400 transition truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{item.meta || 'Study Material'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">PDF</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Latest Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Latest Tests</h3>
              <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</a>
            </div>
            <div className="space-y-3">
              {(mockTests.length > 0 ? mockTests.slice(0,4) : [
                { title: 'Maths Chapter 2 Test', link: 'https://quizizz.com/join', meta: 'Class 10', qs: '20 Qs', time: '20 min' },
                { title: 'Science Chapter 3 Test', link: 'https://quizizz.com/join', meta: 'Class 10', qs: '25 Qs', time: '25 min' },
                { title: 'English Grammar Test', link: 'https://quizizz.com/join', meta: 'Class 9', qs: '15 Qs', time: '15 min' },
                { title: 'Full Syllabus Test', link: 'https://quizizz.com/join', meta: 'Class 10', qs: '50 Qs', time: '60 min' },
              ]).map((item: any, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-slate-800 transition group">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-200 text-sm group-hover:text-indigo-400 transition truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{item.meta || 'Mock Test'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400 shrink-0">
                    <span>{item.qs || '20 Qs'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Past Papers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Past Papers</h3>
              <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</a>
            </div>
            <div className="space-y-3">
              {(pastPapers.length > 0 ? pastPapers.slice(0,4) : [
                { title: '2023 Board Final Exam', link: 'https://via.placeholder.com/800x1200.png?text=2023+Board+Exam+Paper', meta: 'Science • Class 10', type: 'IMAGE' },
                { title: '2022 Half-Yearly Paper', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Maths • Class 10', type: 'PDF' },
                { title: '2021 Previous Year Qs', link: 'https://via.placeholder.com/800x1200.png?text=2021+Previous+Year+Qs', meta: 'English • Class 9', type: 'IMAGE' },
                { title: '2020 State Board Exam', link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', meta: 'Biology • Class 10', type: 'PDF' },
              ]).map((item: any, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-slate-800 transition group">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-200 text-sm group-hover:text-indigo-400 transition truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{item.meta || 'Past Paper'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${item.type === 'PDF' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20'}`}>{item.type || 'FILE'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* For Parents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between opacity-0">
              <h3 className="text-lg font-bold">Spacer</h3>
            </div>
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 text-white relative overflow-hidden h-[360px] flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-[40px]" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-bold">For Parents</h3>
                <p className="text-sm text-indigo-200 font-medium leading-relaxed">Track your child's progress and help them learn better.</p>
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2 text-xs font-medium text-slate-200 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Progress Tracking</div>
                  <div className="flex gap-2 text-xs font-medium text-slate-200 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Test Performance</div>
                  <div className="flex gap-2 text-xs font-medium text-slate-200 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> Screen Time Report</div>
                  <div className="flex gap-2 text-xs font-medium text-slate-200 items-center"><CheckCircle2 className="w-4 h-4 text-green-400" /> No Ads, 100% Safe</div>
                </div>
              </div>
              <img src="/parents_card.png" className="absolute bottom-0 right-0 w-3/4 object-cover translate-y-4 translate-x-4 mix-blend-luminosity opacity-40 grayscale" />
              <button className="relative z-10 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl mt-4 transition text-sm">
                Explore Parent Panel
              </button>
            </div>
          </div>

        </div>

        {/* Footer Features */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 border-t border-white/10 pt-10 mt-12 relative z-10">
          {[
            { title: 'Chapter-wise Notes', sub: 'Detailed & Short Notes', icon: <FileText /> },
            { title: 'PDF Download', sub: 'Easy & Fast Downloads', icon: <Download /> },
            { title: 'Tests & Quizzes', sub: 'Practice & Improve', icon: <CheckCircle2 /> },
            { title: 'Past Papers', sub: 'All Years Available', icon: <BookOpen /> },
            { title: 'AI Doubt Solver', sub: 'Ask Anything, Get Answers', icon: <HelpCircle /> },
            { title: 'Offline Access', sub: 'Study Anywhere', icon: <WifiOff /> },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div>
                <h5 className="font-bold text-slate-200 text-sm">{feat.title}</h5>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

