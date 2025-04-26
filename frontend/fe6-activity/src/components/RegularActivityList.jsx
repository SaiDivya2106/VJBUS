import React, { useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import WebIcon from '@mui/icons-material/Web';
import BuildIcon from '@mui/icons-material/Build';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import './ActivityList.css';

const RegularActivityList = ({ activities, onEdit, onDelete }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  const handleDeleteClick = (activityId) => {
    setSelectedActivityId(activityId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(selectedActivityId);
    setOpenDeleteDialog(false);
    setSelectedActivityId(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedActivityId(null);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'ongoing': return 'warning';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const getActivityIcon = (type) => {
    if (!type) return null;
    
    switch (type.toLowerCase()) {
      // Development & Technical
      case 'project':
        return <BuildIcon fontSize="small" />;
      case 'coding':
        return <CodeIcon fontSize="small" />;
      case 'development':
        return <CodeIcon fontSize="small" />;
      case 'opensource':
        return <CodeIcon fontSize="small" />;
      case 'app':
        return <WebIcon fontSize="small" />;
      case 'website':
        return <WebIcon fontSize="small" />;
      case 'software':
        return <CodeIcon fontSize="small" />;
      case 'research':
        return <ScienceIcon fontSize="small" />;
      
      // Education & Learning
      case 'certification':
        return <BoltIcon fontSize="small" />;
      case 'course':
        return <MenuBookIcon fontSize="small" />;
      case 'workshop':
        return <GroupsIcon fontSize="small" />;
      case 'training':
        return <SchoolIcon fontSize="small" />;
      case 'academic':
        return <SchoolIcon fontSize="small" />;
      
      // Professional
      case 'work':
        return <WorkIcon fontSize="small" />;
      case 'presentation':
        return <PresentToAllIcon fontSize="small" />;
      case 'publication':
        return <MenuBookIcon fontSize="small" />;
      
      // Competitions & Events
      case 'competition':
        return <EmojiEventsIcon fontSize="small" />;
      case 'hackathon':
        return <SportsEsportsIcon fontSize="small" />;
      case 'conference':
        return <GroupsIcon fontSize="small" />;
      
      // Community & Leadership
      case 'volunteer':
        return <VolunteerActivismIcon fontSize="small" />;
      case 'leadership':
        return <GroupsIcon fontSize="small" />;
      case 'community':
        return <GroupsIcon fontSize="small" />;
      case 'club':
        return <GroupsIcon fontSize="small" />;
      
      // Default for unknown types
      default:
        return <StarIcon fontSize="small" />;
    }
  };

  return (
    <div className="activity-list">
      {activities.map((activity, index) => (
        <div key={activity.activity_id || `activity-${index}`} className="activity-card">
          <div className="activity-header">
            <div className="activity-header-left">
              <span className="activity-icon">{getActivityIcon(activity.activity_type)}</span>
              <h3 className="activity-title">{activity.title}</h3>
            </div>
            <div className="activity-header-right">
              <IconButton onClick={() => onEdit(activity)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(activity.activity_id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          <div className="activity-content">
            <p className="activity-description">{activity.description}</p>
            <div className="activity-meta">
              <span className="activity-date">{formatDate(activity.date)}</span>
              {activity.leetcode_rating && (
                <span className="activity-rating">
                  Rating: {activity.leetcode_rating}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegularActivityList; 