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
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans selection:bg-indigo-100">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold italic text-xl">B</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Ban<span className="text-indigo-600">Notes</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition">Classes</a>
          <a href="#" className="hover:text-indigo-600 transition">Subjects</a>
          <a href="#" className="hover:text-indigo-600 transition">Tests</a>
          <a href="#" className="hover:text-indigo-600 transition">Past Papers</a>
          <a href="#" className="hover:text-indigo-600 transition">Toppers</a>
          <a href="#" className="hover:text-indigo-600 transition">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-indigo-600 transition"><Search className="w-5 h-5" /></button>
          <button className="text-slate-500 hover:text-indigo-600 transition"><Moon className="w-5 h-5" /></button>
          <Link href="/login" className="px-5 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
            Login
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-200">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 pt-16 pb-24">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Study Smarter<br/>
              <span className="text-indigo-600">with BanNotes</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-md leading-relaxed font-medium">
              Download chapter-wise notes, tests, PDFs, short notes & past papers for every class — all in one place.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition shadow-xl shadow-indigo-200 flex items-center gap-2">
                Explore Notes <span className="text-xl leading-none">&rarr;</span>
              </button>
              <button className="px-8 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-200 hover:bg-indigo-50 transition flex items-center gap-2">
                Start Learning <span className="text-xl leading-none">&rarr;</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-600">Loved by <span className="text-indigo-600">1M+ Students</span></p>
            </div>
          </div>

          <div className="lg:w-1/2 relative h-[500px] w-full flex justify-end">
            <img src="/hero_boy.png" alt="3D Student" className="h-full object-contain drop-shadow-2xl z-10" />
          </div>
        </div>

        {/* Search Bar - The Camouflage Gateway */}
        <form 
          className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-2 mb-16 border border-slate-100 mx-auto max-w-5xl"
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
              className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-slate-100 text-slate-500 font-medium">
            Select Class <ChevronDown className="w-4 h-4" />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-slate-100 text-slate-500 font-medium">
            Select Subject <ChevronDown className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 border-l border-slate-100 text-slate-500 font-medium">
            All Resources <ChevronDown className="w-4 h-4" />
          </div>
          <button type="submit" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-2">
            Search <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Browse by Class */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Browse by Class</h3>
            <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-500">View All &rarr;</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {[6,7,8,9,10,11,12].map((cls, idx) => {
              const colors = ['bg-green-100 text-green-600', 'bg-orange-100 text-orange-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-indigo-100 text-indigo-600', 'bg-pink-100 text-pink-600', 'bg-teal-100 text-teal-600'];
              return (
                <div key={cls} className="flex-shrink-0 bg-white border border-slate-100 px-6 py-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[idx % colors.length]}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700 whitespace-nowrap">Class {cls}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          
          {/* Trending Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Trending Notes</h3>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">View All</a>
            </div>
            <div className="space-y-3">
              {(notes.length > 0 ? notes.slice(0,4) : [
                { title: 'Chapter 3: Motion & Time', link: '#', meta: 'Science • Class 10', size: '2.4 MB' },
                { title: 'The Human Eye and Colourful World', link: '#', meta: 'Science • Class 10', size: '1.8 MB' },
                { title: 'Linear Equations in Two Variables', link: '#', meta: 'Maths • Class 9', size: '1.6 MB' },
                { title: 'Life Processes', link: '#', meta: 'Biology • Class 10', size: '2.1 MB' },
              ]).map((item: any, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition group">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium truncate">{item.meta || 'Study Material'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">PDF</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Latest Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Latest Tests</h3>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">View All</a>
            </div>
            <div className="space-y-3">
              {(mockTests.length > 0 ? mockTests.slice(0,4) : [
                { title: 'Maths Chapter 2 Test', meta: 'Class 10', qs: '20 Qs', time: '20 min' },
                { title: 'Science Chapter 3 Test', meta: 'Class 10', qs: '25 Qs', time: '25 min' },
                { title: 'English Grammar Test', meta: 'Class 9', qs: '15 Qs', time: '15 min' },
                { title: 'Full Syllabus Test', meta: 'Class 10', qs: '50 Qs', time: '60 min' },
              ]).map((item: any, i) => (
                <a key={i} href={item.link} target="_blank" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition group">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition truncate">{item.title}</h4>
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

          {/* Top Scorers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Top Scorers</h3>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">View All</a>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 shadow-sm">
              {[
                { name: 'Ananya Sharma', class: 'Class 10', score: '98%', img: 1 },
                { name: 'Arjun Verma', class: 'Class 10', score: '96%', img: 2 },
                { name: 'Riya Patel', class: 'Class 9', score: '95%', img: 3 },
                { name: 'Kabir Singh', class: 'Class 9', score: '94%', img: 4 },
                { name: 'Meera Joshi', class: 'Class 9', score: '93%', img: 5 },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">{i + 1}</span>
                    <img src={`https://i.pravatar.cc/100?img=${student.img + 20}`} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{student.class}</p>
                    </div>
                  </div>
                  <span className="font-bold text-indigo-600">{student.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* For Parents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between opacity-0">
              <h3 className="text-lg font-bold">Spacer</h3>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden h-[360px] flex flex-col justify-between shadow-xl shadow-indigo-200">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-bold">For Parents</h3>
                <p className="text-sm text-indigo-100 font-medium leading-relaxed">Track your child's progress and help them learn better.</p>
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2 text-xs font-medium text-white/90 items-center"><CheckCircle2 className="w-4 h-4 text-green-300" /> Progress Tracking</div>
                  <div className="flex gap-2 text-xs font-medium text-white/90 items-center"><CheckCircle2 className="w-4 h-4 text-green-300" /> Test Performance</div>
                  <div className="flex gap-2 text-xs font-medium text-white/90 items-center"><CheckCircle2 className="w-4 h-4 text-green-300" /> Screen Time Report</div>
                  <div className="flex gap-2 text-xs font-medium text-white/90 items-center"><CheckCircle2 className="w-4 h-4 text-green-300" /> No Ads, 100% Safe</div>
                </div>
              </div>
              <img src="/parents_card.png" className="absolute bottom-0 right-0 w-3/4 object-cover translate-y-4 translate-x-4 mix-blend-luminosity opacity-50" />
              <button className="relative z-10 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl mt-4 hover:bg-slate-50 transition shadow-lg text-sm">
                Explore Parent Panel
              </button>
            </div>
          </div>

        </div>

        {/* Footer Features */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 border-t border-slate-200 pt-10 mt-12">
          {[
            { title: 'Chapter-wise Notes', sub: 'Detailed & Short Notes', icon: <FileText /> },
            { title: 'PDF Download', sub: 'Easy & Fast Downloads', icon: <Download /> },
            { title: 'Tests & Quizzes', sub: 'Practice & Improve', icon: <CheckCircle2 /> },
            { title: 'Past Papers', sub: 'All Years Available', icon: <BookOpen /> },
            { title: 'AI Doubt Solver', sub: 'Ask Anything, Get Answers', icon: <HelpCircle /> },
            { title: 'Offline Access', sub: 'Study Anywhere', icon: <WifiOff /> },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {feat.icon}
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-sm">{feat.title}</h5>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{feat.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

