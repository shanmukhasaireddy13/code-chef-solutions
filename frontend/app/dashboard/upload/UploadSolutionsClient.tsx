"use client";

import { useState, useEffect } from 'react';
import { Upload, Check, AlertCircle, Plus, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Contest {
    _id: string;
    name: string;
    status: string;
}

interface UploadSolutionsClientProps {
    contestsUrl: string;
    solutionsUrl: string;
}

export default function UploadSolutionsClient({ contestsUrl, solutionsUrl }: UploadSolutionsClientProps) {
    const [activeTab, setActiveTab] = useState<'solution' | 'contest'>('solution');
    const [contests, setContests] = useState<Contest[]>([]);

    // Solution Form State
    const [solutionData, setSolutionData] = useState({
        contestId: '',
        problemId: '',
        name: '',
        difficulty: 'Easy',
        price: 15,
        content: ''
    });

    // Contest Form State
    const [contestData, setContestData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        duration: '',
        status: 'Upcoming',
        type: 'Rated'
    });

    const [loading, setLoading] = useState(false);

    // Fetch contests on mount
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await fetch(contestsUrl);
                if (response.ok) {
                    const data = await response.json();
                    // Combine live and upcoming contests
                    const allContests = [...(data.live || []), ...(data.upcoming || [])];
                    setContests(allContests);
                }
            } catch (error) {
                console.error("Error fetching contests:", error);
                toast.error("Failed to load contests");
            }
        };

        fetchContests();
    }, [contestsUrl]);

    // Calculate duration automatically
    useEffect(() => {
        if (contestData.startTime && contestData.endTime) {
            const start = new Date(contestData.startTime);
            const end = new Date(contestData.endTime);
            const diffMs = end.getTime() - start.getTime();

            if (diffMs > 0) {
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                setContestData(prev => ({ ...prev, duration: `${diffHrs}h ${diffMins}m` }));
            } else {
                setContestData(prev => ({ ...prev, duration: '' }));
            }
        }
    }, [contestData.startTime, contestData.endTime]);

    const handleSolutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSolutionData(prev => ({ ...prev, [name]: value }));
    };

    const handleContestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setContestData(prev => ({ ...prev, [name]: value }));
    };

    const handleSolutionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(solutionsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(solutionData),
            });

            if (response.ok) {
                toast.success("Solution uploaded successfully!");
                setSolutionData({
                    contestId: '',
                    problemId: '',
                    name: '',
                    difficulty: 'Easy',
                    price: 15,
                    content: ''
                });
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to upload solution");
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Error uploading solution");
        } finally {
            setLoading(false);
        }
    };

    const handleContestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(contestsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(contestData),
            });

            if (response.ok) {
                toast.success("Contest created successfully!");
                setContestData({
                    name: '',
                    startTime: '',
                    endTime: '',
                    duration: '',
                    status: 'Upcoming',
                    type: 'Rated'
                });
                // Refresh contests list
                const refreshResponse = await fetch(contestsUrl);
                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setContests([...(data.live || []), ...(data.upcoming || [])]);
                }
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to create contest");
            }
        } catch (error) {
            console.error("Creation error", error);
            toast.error("Error creating contest");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 placeholder:text-zinc-400";

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Admin Management</h1>
                <p className="text-zinc-500">Manage contests and solutions.</p>
            </div>

            <div className="flex gap-4 mb-6 border-b border-zinc-200">
                <button
                    onClick={() => setActiveTab('solution')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'solution' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    Upload Solution
                    {activeTab === 'solution' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('contest')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'contest' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    Create Contest
                    {activeTab === 'contest' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'solution' ? (
                <form onSubmit={handleSolutionSubmit} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Contest</label>
                            <select
                                name="contestId"
                                value={solutionData.contestId}
                                onChange={handleSolutionChange}
                                required
                                className={inputClasses}
                            >
                                <option value="">Select a Contest</option>
                                {contests.map(contest => (
                                    <option key={contest._id} value={contest._id}>
                                        {contest.name} ({contest.status})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Problem ID</label>
                            <input
                                type="text"
                                name="problemId"
                                value={solutionData.problemId}
                                onChange={handleSolutionChange}
                                required
                                className={inputClasses}
                                placeholder="e.g., PROBLEM1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Solution Name</label>
                        <input
                            type="text"
                            name="name"
                            value={solutionData.name}
                            onChange={handleSolutionChange}
                            required
                            className={inputClasses}
                            placeholder="e.g., Optimal Solution in C++"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Difficulty</label>
                            <select
                                name="difficulty"
                                value={solutionData.difficulty}
                                onChange={handleSolutionChange}
                                className={inputClasses}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Price (Credits)</label>
                            <input
                                type="number"
                                name="price"
                                value={solutionData.price}
                                onChange={handleSolutionChange}
                                required
                                min="0"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Content (Markdown/Code)</label>
                        <textarea
                            name="content"
                            value={solutionData.content}
                            onChange={handleSolutionChange}
                            required
                            rows={10}
                            className={`${inputClasses} font-mono text-sm`}
                            placeholder="# Solution Code..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload Solution
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleContestSubmit} className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Contest Name</label>
                        <input
                            type="text"
                            name="name"
                            value={contestData.name}
                            onChange={handleContestChange}
                            required
                            className={inputClasses}
                            placeholder="e.g., Starters 100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Start Time</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={contestData.startTime}
                                    onChange={handleContestChange}
                                    required
                                    className={inputClasses}
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">End Time</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={contestData.endTime}
                                    onChange={handleContestChange}
                                    required
                                    className={inputClasses}
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Duration</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="duration"
                                    value={contestData.duration}
                                    readOnly
                                    className={`${inputClasses} bg-zinc-50`}
                                    placeholder="Auto-calculated"
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Status</label>
                            <select
                                name="status"
                                value={contestData.status}
                                onChange={handleContestChange}
                                className={inputClasses}
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Live">Live</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Type</label>
                            <select
                                name="type"
                                value={contestData.type}
                                onChange={handleContestChange}
                                className={inputClasses}
                            >
                                <option value="Rated">Rated</option>
                                <option value="Unrated">Unrated</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Create Contest
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
