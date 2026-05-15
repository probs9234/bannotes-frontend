'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Search, ShieldAlert, GraduationCap, Video } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden dark">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-slow" />
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-dark top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-400 w-8 h-8" />
            <span className="text-2xl font-bold text-gradient tracking-tight">BanNotes</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#notes" className="hover:text-blue-400 transition">Study Notes</a>
            <a href="#papers" className="hover:text-blue-400 transition">Past Papers</a>
            <a href="#mock" className="hover:text-blue-400 transition">Mock Tests</a>
          </div>
          <div>
            <Link href="/login" className="px-5 py-2 rounded-full glass hover:bg-white/20 transition text-sm font-medium">
              Student Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mt-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full glass-dark text-xs font-semibold text-blue-300 uppercase tracking-wider mb-6 inline-block">
              Class 12 Premium Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
              Download Class 12 <br/>
              <span className="text-gradient">Notes & Study Materials</span>
            </h1>
            <p className="mt-6 text-slate-300 max-w-2xl mx-auto text-lg">
              Access the most comprehensive collection of PDF notes, previous year papers, and smart learning tools designed for top achievers.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex w-full max-w-lg relative"
            onSubmit={(e) => {
              e.preventDefault();
              const partner = (e.currentTarget.elements.namedItem('partner') as HTMLInputElement).value;
              if (partner.trim()) {
                localStorage.setItem('partner', partner.trim());
                window.location.href = '/login';
              }
            }}
          >
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              name="partner"
              placeholder="Find notes, books, papers..." 
              className="w-full glass-dark py-3 pl-12 pr-24 rounded-full outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-500 text-white"
            />
            <button type="submit" className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition">
              Search
            </button>
          </motion.form>
        </div>

        {/* Dynamic Study Materials Grid */}
        <div id="notes" className="mt-32 space-y-24">
          
          {/* Notes Section */}
          <section>
            <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3">
              <BookOpen className="text-blue-400" /> Study Notes
            </h2>
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((mat, idx) => (
                  <motion.div key={mat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:animate-float">
                      <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{mat.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">Complete syllabus notes & derivations.</p>
                    <a href={mat.link} target="_blank" className="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:text-blue-300">
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 italic">No notes uploaded yet. Check back later!</p>
            )}
          </section>

          {/* Past Papers Section */}
          <section id="papers">
            <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3">
              <BookOpen className="text-purple-400" /> Past Papers
            </h2>
            {pastPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastPapers.map((mat, idx) => (
                  <motion.div key={mat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:animate-float">
                      <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{mat.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">Previous year question papers with solutions.</p>
                    <a href={mat.link} target="_blank" className="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:text-blue-300">
                      <Download className="w-4 h-4" /> Download PDF
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 italic">No past papers uploaded yet.</p>
            )}
          </section>

          {/* Mock Tests Section */}
          <section id="mock">
            <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-3">
              <BookOpen className="text-orange-400" /> Mock Tests
            </h2>
            {mockTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTests.map((mat, idx) => (
                  <motion.div key={mat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:animate-float">
                      <BookOpen className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{mat.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">Practice mock tests to check your preparation.</p>
                    <a href={mat.link} target="_blank" className="flex items-center gap-2 text-sm text-blue-400 font-medium group-hover:text-blue-300">
                      <Download className="w-4 h-4" /> Start Test
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 italic">No mock tests available currently.</p>
            )}
          </section>

        </div>

      </main>
    </div>
  );
}
