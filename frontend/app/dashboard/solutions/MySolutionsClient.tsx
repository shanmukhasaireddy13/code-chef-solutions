"use client";

import Link from 'next/link';
import { FileCode, ExternalLink, Calendar, Search, Folder, LayoutGrid, List as ListIcon, ChevronRight, HardDrive, Clock } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ROUTES } from '@/lib/api';

interface Solution {
  _id: string;
  name: string;
  difficulty: string;
  contestId: string;
  createdAt: string;
  language?: string;
}

function SolutionDetails({ solution, onClose }: { solution: Solution, onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-zinc-500"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      )}
      <div className="p-8 flex flex-col items-center text-center border-b border-zinc-200/50 mt-8 md:mt-0">
        <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-zinc-100 flex items-center justify-center mb-4">
          <FileCode className="w-12 h-12 text-blue-500" strokeWidth={1} />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-1">{solution.name}</h3>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{solution.difficulty} • {solution.language || 'C++'}</p>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Created</span>
              <span className="text-zinc-900">{new Date(solution.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Size</span>
              <span className="text-zinc-900">2.4 KB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Kind</span>
              <span className="text-zinc-900">C++ Source</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tags</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-100">Algorithm</span>
            <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-xs font-medium border border-zinc-200">Contest</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 bg-white">
        <Link
          href={
            window.location.search.includes('tour=true')
              ? `/dashboard/solutions/${solution._id}?tour=true&tourStep=12`
              : `/dashboard/solutions/${solution._id}`
          }
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
          id="solution-view-btn"
        >
          Open Solution <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function MySolutionsClient({ initialSolutions }: { initialSolutions: Solution[] }) {
  const contestsUrl = API_ROUTES.CONTESTS;
  const [contestNames, setContestNames] = useState<{ [key: string]: string }>({});
  const [selectedContestId, setSelectedContestId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolutionId, setSelectedSolutionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(contestsUrl);
        if (response.ok) {
          const data = await response.json();
          // data.live and data.upcoming are arrays. We need to combine them or just handle the structure.
          // Actually, let's assume the endpoint returns { live: [], upcoming: [] } or just an array.
          // Based on previous search, it returns { live: [], upcoming: [] }.
          // But we might need past contests too if solutions are from past contests.
          // For now, let's just map what we get.
          const map: { [key: string]: string } = {};
          [...(data.live || []), ...(data.upcoming || [])].forEach((c: any) => {
            map[c._id] = c.name;
          });
          setContestNames(map);
        }
      } catch (error) {
        console.error("Failed to fetch contests", error);
      }
    };
    fetchContests();
  }, [contestsUrl]);

  // Group solutions by contest
  const contests = useMemo(() => {
    const groups: { [key: string]: { id: string, name: string, count: number } } = {};
    initialSolutions.forEach(sol => {
      if (!groups[sol.contestId]) {
        // Use fetched name or fallback to ID
        const name = contestNames[sol.contestId] || `Contest ${sol.contestId.substring(0, 6)}...`;
        groups[sol.contestId] = { id: sol.contestId, name, count: 0 };
      }
      groups[sol.contestId].count++;
    });
    return Object.values(groups);
  }, [initialSolutions, contestNames]);

  const filteredSolutions = useMemo(() => {
    let filtered = [...initialSolutions];

    if (selectedContestId !== 'all') {
      filtered = filtered.filter(s => s.contestId === selectedContestId);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [initialSolutions, searchQuery, selectedContestId]);

  const selectedSolution = useMemo(() =>
    initialSolutions.find(s => s._id === selectedSolutionId),
    [initialSolutions, selectedSolutionId]);

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12 px-4 h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900">My Solutions</h1>
        <p className="text-zinc-500">Manage and view your purchased code solutions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden flex flex-1 flex-col md:flex-row">

        {/* Sidebar - Finder Style */}
        <div className="w-full md:w-64 bg-zinc-50/50 border-r border-zinc-200 flex flex-col max-h-48 md:max-h-none overflow-hidden md:overflow-visible border-b md:border-b-0">
          <div className="p-4 border-b border-zinc-200/50">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">Locations</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => { setSelectedContestId('all'); setSelectedSolutionId(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedContestId === 'all'
                ? 'bg-zinc-200/60 text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100'
                }`}
            >
              <HardDrive className="w-4 h-4 text-zinc-500" />
              All Solutions
            </button>

            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contests</p>
            </div>

            {contests.map(contest => (
              <button
                key={contest.id}
                onClick={() => { setSelectedContestId(contest.id); setSelectedSolutionId(null); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedContestId === contest.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
              >
                <Folder className={`w-4 h-4 ${selectedContestId === contest.id ? 'text-blue-500' : 'text-blue-300'}`} fill="currentColor" />
                <span className="truncate flex-1 text-left">{contest.name}</span>
                <span className="text-xs text-zinc-400">{contest.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - File List */}
        <div className="flex-1 flex flex-col min-w-0 bg-white" id="solutions-table">
          {/* Toolbar */}
          <div className="h-12 border-b border-zinc-200 flex items-center justify-between px-4 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-zinc-900">
                {selectedContestId === 'all' ? 'All Solutions' : contests.find(c => c.id === selectedContestId)?.name}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-48 transition-all"
              />
            </div>
          </div>

          {/* Files Grid/List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredSolutions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <Folder className="w-16 h-16 mb-4 text-zinc-200" />
                <p className="text-sm">No solutions found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSolutions.map((solution, index) => (
                  <motion.button
                    key={solution._id}
                    id={index === 0 ? "tour-first-solution" : undefined}
                    layoutId={solution._id}
                    onClick={() => setSelectedSolutionId(solution._id)}
                    className={`group flex flex-col items-center p-4 rounded-xl transition-all ${selectedSolutionId === solution._id
                      ? 'bg-blue-50 ring-2 ring-blue-500/20'
                      : 'hover:bg-zinc-50'
                      }`}
                  >
                    <div className="w-16 h-16 mb-3 bg-white rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileCode className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                    </div>
                    <span className={`text-sm font-medium text-center line-clamp-2 ${selectedSolutionId === solution._id ? 'text-blue-700' : 'text-zinc-700'
                      }`}>
                      {solution.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1">
                      {new Date(solution.createdAt).toLocaleDateString()}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview Pane (Right Side) */}
        {/* Preview Pane (Right Side) - Desktop */}
        <AnimatePresence mode="wait">
          {selectedSolution && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-80 border-l border-zinc-200 bg-zinc-50/30 flex-col overflow-hidden hidden xl:flex"
            >
              <SolutionDetails solution={selectedSolution} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile/Tablet Preview Drawer */}
        <AnimatePresence>
          {selectedSolution && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSolutionId(null)}
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm xl:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl xl:hidden"
              >
                <SolutionDetails solution={selectedSolution} onClose={() => setSelectedSolutionId(null)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
