import React, { useState, useEffect } from 'react';
import { X, Code2, Tags, MessageCircle, Trash, ThumbsUp, PlayCircle, Share2 } from 'lucide-react';
import { Project } from '../types';

const API_URL = `${import.meta.env.VITE_API_URL || ''}`;
interface ProjectModalProps {
  user: {
    name: string;
    email: string;
    picture: string;
  };
  project: Project;
  onClose: () => void;
}

function ProjectModal({ user, project, onClose }: ProjectModalProps) {
  // Add state for PDF page navigation (must be at the top, before return)
  const [pdfPage, setPdfPage] = useState(1);
  useEffect(() => { setPdfPage(1); }, [project.pdfPoster]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [teamDetails, setTeamDetails] = useState<string[]>([]);

  const formatDateToIST = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(date);
  };

  function showAlert(message: string) {
    const alertBox = document.createElement("div");
    alertBox.innerText = message;

    alertBox.style.position = "fixed";
    alertBox.style.bottom = "20px";
    alertBox.style.right = "20px";
    alertBox.style.padding = "10px 16px";
    alertBox.style.background = "#000";
    alertBox.style.color = "#fff";
    alertBox.style.borderRadius = "8px";
    alertBox.style.fontSize = "14px";
    alertBox.style.zIndex = "9999";

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 2000);
  }


  useEffect(() => {
    if (project.id) {
      fetch(`${API_URL}/projects/${project.id}/comments-upvotes`)
        .then(res => res.json())
        .then(data => setComments(data.comments))
        .catch(err => console.error('Failed to fetch comments:', err));

      fetch(`${API_URL}/projects/${project.id}`)
        .then(res => res.json())
        .then(data => {
          const details = (data.team_details as string)
            ?.split(/\r?\n/)
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0);
          setTeamDetails(details || []);
        })
        .catch(err => console.error('Failed to fetch team details:', err));

      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      setIsLiked(likedProjects.includes(project.id));
    }
  }, [project.id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
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
    const response = await fetch(`${API_URL}/projects/${project.id}/comment/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: user.name }),
    });

    if (response.ok) {
      const updatedCommentsResponse = await fetch(`${API_URL}/projects/${project.id}/comments-upvotes`);
      const updatedCommentsData = await updatedCommentsResponse.json();
      setComments(updatedCommentsData.comments);
    } else {
      console.error('Error deleting comment');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard.writeText(url);
    showAlert('Project URL copied to clipboard!');
  };

  const handleLike = async () => {
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

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden m-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Title Bar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          {/* Title takes remaining space */}
          <h2 className="flex-1 text-2xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
            {project.title}
          </h2>

          {/* Right side: department + close */}
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1 rounded-full text-sm font-medium text-gray-800 whitespace-nowrap">
              {project.department}
            </span>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>


        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm font-medium mt-2 p-2 rounded-full hover:bg-emerald-100 transition-colors ${isLiked ? 'text-emerald-600 fill-emerald-600 bg-emerald-100' : 'text-gray-600'}`}
            >
              <ThumbsUp size={20} />
              Like
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-sm font-medium mt-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>

          {/* Horizontally scrollable images */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {project.images.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg bg-black flex items-center justify-center min-w-[300px] max-w-[500px] h-[220px]">
                <img
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Abstract</h3>
            <p className="text-gray-600">{project.abstract}</p>
          </div>

          {project.pdfPoster && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Poster</h3>
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full flex flex-col items-center">
                  <div className="flex items-center justify-center w-full">
                    <button
                      className="absolute left-0 z-10 bg-white/80 hover:bg-emerald-100 rounded-full p-2 m-2 shadow"
                      onClick={() => setPdfPage((prev) => Math.max(1, prev - 1))}
                      aria-label="Previous page"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      &#8592;
                    </button>
                    <iframe
                      key={pdfPage}
                      src={`${project.pdfPoster}#page=${pdfPage}`}
                      title="Project Poster"
                      className="w-full max-w-2xl h-96 border rounded-lg shadow"
                    />
                    <button
                      className="absolute right-0 z-10 bg-white/80 hover:bg-emerald-100 rounded-full p-2 m-2 shadow"
                      onClick={() => setPdfPage((prev) => prev + 1)}
                      aria-label="Next page"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                    >
                      &#8594;
                    </button>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">Page {pdfPage}</div>
                </div>
                <button
                  className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => window.open(project.pdfPoster ?? '', '_blank')}
                >
                  Open Full Poster in New Tab
                </button>
              </div>
            </div>
          )}

          {teamDetails.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Details</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                {teamDetails.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Code2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">Domain</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-cyan-50 text-gray-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tags className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-cyan-50 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {project.demoUrl && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Demo</h3>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                <PlayCircle className="h-5 w-5" />
                Watch the Demo
              </a>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
            </div>
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-800">{comment.user_name}</p>
                      {comment.user_name === user.name && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600">{comment.comment_text}</p>
                    <span className="text-xs text-gray-500">
                      {formatDateToIST(comment.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              )}
            </div>
            <div className="space-y-4 mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmitting || !commentText.trim()}
                className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300"
              >
                {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
