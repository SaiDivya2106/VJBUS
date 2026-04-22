import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code2, Tags, MessageCircle, Trash, ThumbsUp, PlayCircle, ArrowLeft } from 'lucide-react';
import { Project } from '../types';
import Navbar from './Navbar';

const API_URL = `${import.meta.env.VITE_API_URL || ''}`;

interface ProjectDetailProps {
    user: {
        name: string;
        email: string;
        picture: string;
    } | null;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

function ProjectDetail({ user, setUser }: ProjectDetailProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [pdfPage, setPdfPage] = useState(1);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [teamDetails, setTeamDetails] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDateToIST = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Kolkata',
        }).format(date);
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`${API_URL}/projects/${id}`)
                .then(res => res.json())
                .then(data => {
                    const formattedProject: Project = {
                        id: data.id,
                        title: data.title,
                        abstract: data.abstract,
                        domain: data.domain || '',
                        cover_poster: data.cover_poster,
                        techStack: data.domain ? [data.domain] : [],
                        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
                        thumbnail: data.cover_poster ? `${API_URL}/uploads/${data.cover_poster}` : 'https://via.placeholder.com/500x300?text=No+Cover',
                        images: [
                            data.cover_poster
                                ? `${API_URL}/uploads/${data.cover_poster}`
                                : 'https://via.placeholder.com/800x500?text=No+Cover',
                            data.result
                                ? `${API_URL}/uploads/${data.result}`
                                : 'https://via.placeholder.com/800x500?text=No+Result',
                            data.methodology
                                ? `${API_URL}/uploads/${data.methodology}`
                                : 'https://via.placeholder.com/800x500?text=No+Methodology'
                        ],
                        demoUrl: data.drive_link || '#',
                        likes: data.aggr_upvote_count || 0,
                        comments: data.agggr_comment_count || 0,
                        department: data.department || 'General',
                        team: data.team_details || '',
                        mentor: data.mentor_name || '',
                        isSoftware: data.is_software === 'true',
                        startupPotential: data.startup_potential || '',
                        uploadedBy: data.user_name || '',
                        pdfPoster: data.pdf_poster
                            ? `${API_URL}/uploads/${data.pdf_poster}`
                            : null
                    };
                    setProject(formattedProject);
                    const details = (data.team_details as string)
                        ?.split(/\r?\n/)
                        .map((line: string) => line.trim())
                        .filter((line: string) => line.length > 0);
                    setTeamDetails(details || []);

                    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
                    setIsLiked(likedProjects.includes(data.id));
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch project details:', err);
                    setLoading(false);
                });

            fetch(`${API_URL}/projects/${id}/comments-upvotes`)
                .then(res => res.json())
                .then(data => setComments(data.comments))
                .catch(err => console.error('Failed to fetch comments:', err));
        }
    }, [id]);

    const handleAddComment = async () => {
        if (!commentText.trim() || !user || !project) return;
        setIsSubmitting(true);

        const response = await fetch(`${API_URL}/projects/${project.id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name: user.name, comment_text: commentText }),
        });

        if (response.ok) {
            const newComment = {
                id: Date.now(),
                user_name: user.name,
                comment_text: commentText,
                created_at: new Date().toISOString(),
            };
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
        } else {
            console.error('Error adding comment');
        }

        setIsSubmitting(false);
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!user || !project) return;
        const response = await fetch(`${API_URL}/projects/${project.id}/comment/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_name: user.name }),
        });

        if (response.ok) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        } else {
            console.error('Error deleting comment');
        }
    };

    const handleLike = async () => {
        if (!user || !project) return;
        const user_name = user.name;

        if (isLiked) {
            const response = await fetch(`${API_URL}/projects/${project.id}/remove-vote`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name }),
            });

            if (response.ok) {
                setIsLiked(false);
                const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
                const updated = likedProjects.filter((id: number) => id !== project.id);
                localStorage.setItem('likedProjects', JSON.stringify(updated));
            } else {
                console.error('Error removing like');
            }
        } else {
            const response = await fetch(`${API_URL}/projects/${project.id}/upvote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name }),
            });

            if (response.ok) {
                setIsLiked(true);
                const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
                likedProjects.push(project.id);
                localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
            } else {
                console.error('Error upvoting');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
                    <button onClick={() => navigate('/')} className="text-emerald-600 hover:underline">Go back home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar currentRoute="projects" user={user} setUser={setUser} onGoogleCredentialResponse={() => { }} />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Projects
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                            {project.title}
                        </h1>
                        <span className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-100 self-start md:self-center">
                            {project.department}
                        </span>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Actions Bar */}
                        <div className="flex items-center gap-6 border-b border-gray-50 pb-6">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isLiked ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            >
                                <ThumbsUp size={22} className={isLiked ? 'fill-emerald-600' : ''} />
                                <span className="font-medium">Like</span>
                            </button>
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                >
                                    <PlayCircle size={22} />
                                    <span className="font-medium">Watch Demo</span>
                                </a>
                            )}
                        </div>

                        {/* Images Gallery */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">Project Gallery</h3>
                            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
                                {project.images.map((image, index) => (
                                    <div key={index} className="snap-center flex-shrink-0 group relative overflow-hidden rounded-2xl bg-gray-100 w-full md:w-[600px] h-[350px]">
                                        <img
                                            src={image}
                                            alt={`${project.title} gallery ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-10">
                                <section>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        Abstract
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {project.abstract}
                                    </p>
                                </section>

                                {project.pdfPoster && (
                                    <section>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Poster</h3>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center gap-6">
                                            <div className="relative w-full aspect-[4/3] max-h-[600px] bg-white rounded-lg overflow-hidden shadow-inner">
                                                <iframe
                                                    key={pdfPage}
                                                    src={`${project.pdfPoster}#page=${pdfPage}`}
                                                    title="Project Poster"
                                                    className="w-full h-full"
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center px-2">
                                                    <button
                                                        onClick={() => setPdfPage((prev) => Math.max(1, prev - 1))}
                                                        className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-emerald-50 text-emerald-600 disabled:opacity-50"
                                                        disabled={pdfPage === 1}
                                                    >
                                                        <ArrowLeft size={24} />
                                                    </button>
                                                </div>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                                    <button
                                                        onClick={() => setPdfPage((prev) => prev + 1)}
                                                        className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-emerald-50 text-emerald-600"
                                                    >
                                                        <ArrowLeft size={24} className="rotate-180" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-gray-500">Page {pdfPage}</span>
                                                <button
                                                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                                                    onClick={() => window.open(project.pdfPoster ?? '', '_blank')}
                                                >
                                                    Open PDF Fullscreen
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>

                            <div className="space-y-8">
                                <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-700">
                                        <Code2 size={24} />
                                        <h3 className="text-xl font-semibold">Team & Mentor</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Team Members</h4>
                                            <ul className="space-y-2">
                                                {teamDetails.map((member, idx) => (
                                                    <li key={idx} className="text-gray-700 font-medium">{member}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        {project.mentor && (
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Mentor</h4>
                                                <p className="text-gray-700 font-medium">{project.mentor}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-700">
                                        <Tags size={24} />
                                        <h3 className="text-xl font-semibold">Classification</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Domain</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map((tech) => (
                                                    <span key={tech} className="px-3 py-1 bg-white border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span key={tag} className="px-3 py-1 bg-white border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <section className="border-t border-gray-100 pt-10">
                            <div className="flex items-center gap-3 mb-8">
                                <MessageCircle size={28} className="text-emerald-500" />
                                <h3 className="text-2xl font-bold text-gray-800">Discussion</h3>
                            </div>

                            <div className="max-w-3xl space-y-8">
                                <div className="space-y-4">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows={4}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 resize-none transition-all"
                                        placeholder="Share your thoughts or ask a question..."
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={isSubmitting || !commentText.trim() || !user}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 shadow-lg shadow-emerald-100 transition-all ml-auto block"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                    {!user && <p className="text-sm text-red-500 text-right">Please login to comment</p>}
                                </div>

                                <div className="space-y-6 pt-6">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{comment.user_name}</p>
                                                        <p className="text-xs text-gray-400">{formatDateToIST(comment.created_at)}</p>
                                                    </div>
                                                    {user && comment.user_name === user.name && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{comment.comment_text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-2xl">
                                            <p className="text-gray-400">No comments yet. Start the conversation!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProjectDetail;
