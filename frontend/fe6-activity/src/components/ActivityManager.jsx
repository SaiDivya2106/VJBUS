// src/components/ActivityManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Button, Typography, Paper } from '@mui/material';
import RegularActivityList from './RegularActivityList';
import DailyActivityList from './DailyActivityList';
import AddActivity from './AddActivity';
import axios from 'axios';
import './ActivityList.css';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TodayIcon from '@mui/icons-material/Today';
const base_url = import.meta.env.VITE_API_BASE_URL;

const ActivityManager = () => {
  const [regularActivities, setRegularActivities] = useState([]);
  const [dailyActivities, setDailyActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDailyActivities, setLoadingDailyActivities] = useState(true);
  const [error, setError] = useState('');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    activity_type: '',
    status: 'ongoing',
    skills: [],
    start_date: '',
    end_date: '',
    date: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Activity types - removed Education, Experience, and LeetCode entries
  const activityTypes = [
    'Project',
    'Certification',
    'Workshop',
    'Hackathon',
    'Publication',
    'Volunteer',
    'Other'
  ];

  // Listen for activity updates from Dashboard's AddActivity
  useEffect(() => {
    const handleActivityAdded = () => {
      console.log('Activity added event detected');
      fetchRegularActivities();
      fetchDailyActivities();
    };

    // Add event listener for activity updates
    window.addEventListener('activity-added', handleActivityAdded);

    // Cleanup
    return () => {
      window.removeEventListener('activity-added', handleActivityAdded);
    };
  }, []);

  useEffect(() => {
    fetchRegularActivities();
    fetchDailyActivities();
  }, [lastRefresh]);

  // Create memoized fetch functions to avoid unnecessary re-renders
  const fetchRegularActivities = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${base_url}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegularActivities(response.data);
    } catch (err) {
      console.error('Error fetching regular activities:', err);
      setError('Failed to load regular activities');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyActivities = useCallback(async () => {
    setLoadingDailyActivities(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${base_url}/api/daily_activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailyActivities(response.data);
    } catch (error) {
      console.error("Error fetching daily activities:", error);
      setError('Failed to fetch daily activities');
    } finally {
      setLoadingDailyActivities(false);
    }
  }, []);

  const handleAddActivity = (type, newActivity) => {
    if (type === 'regular') {
      setRegularActivities(prev => [newActivity, ...prev]);
    } else if (type === 'daily') {
      setDailyActivities(prev => [newActivity, ...prev]);
    }
    setSnackbarMessage(`${type === 'regular' ? 'Activity' : 'Daily activity'} added successfully!`);
    setSnackbarOpen(true);
    
    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('activity-added', { detail: { type, activity: newActivity } }));
  };

  const handleEditActivity = (activity) => {
    setEditingActivity({
      ...activity,
      isDaily: false // Flag to identify this as a regular activity
    });
    setEditFormData({
      title: activity.title,
      description: activity.description,
      activity_type: activity.activity_type || '',
      status: activity.status || 'ongoing',
      skills: activity.skills || [],
      start_date: activity.start_date || '',
      end_date: activity.end_date || '',
      date: activity.date || ''
    });
  };

  const handleEditDailyActivity = (activity) => {
    setEditingActivity({
      ...activity,
      isDaily: true // Flag to identify this as a daily activity
    });
    setEditFormData({
      title: activity.title,
      description: activity.description,
      start_date: activity.start_date || '',
      end_date: activity.end_date || '',
      date: activity.date || ''
    });
  };

  const handleDeleteActivity = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${base_url}/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegularActivities(prev => prev.filter(a => a.activity_id !== id));
      setSnackbarMessage('Activity deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity');
    }
  };

  const handleDeleteDailyActivity = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${base_url}/api/daily_activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailyActivities(prev => prev.filter(a => a.daily_activity_id !== id));
      setSnackbarMessage('Daily activity deleted successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error deleting daily activity:', err);
      setError('Failed to delete daily activity');
    }
  };

  return (
    <Box className="activity-container">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Note: Education and Experience entries should be added through the Resume Builder's dedicated sections. 
        These sections provide specialized fields for better formatting in your resume.
      </Alert> */}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Major Activities
          </Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>Loading activities...</Box>
          ) : regularActivities.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>No Major Activities Yet</Typography>
              <Typography variant="body2">
                Start adding your projects, certifications, and other achievements to showcase in your resume.
              </Typography>
            </Box>
          ) : (
            <RegularActivityList
              activities={regularActivities}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          )}
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TodayIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Daily Activities
          </Typography>
        </Box>
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          {loadingDailyActivities ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>Loading daily activities...</Box>
          ) : dailyActivities.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>No Daily Activities Yet</Typography>
              <Typography variant="body2">
                Track your daily progress by adding activities like coding practice, learning sessions, or project updates.
              </Typography>
            </Box>
          ) : (
            <DailyActivityList
              daily_activities_prop={dailyActivities}
              onEdit={handleEditDailyActivity}
              onDelete={handleDeleteDailyActivity}
            />
          )}
        </Paper>
      </Box>

      <AddActivity 
        open={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        onActivityAdded={handleAddActivity}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

      {editingActivity && (
        <Dialog
          open={!!editingActivity}
          onClose={() => setEditingActivity(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Edit {editingActivity.isDaily ? 'Daily Activity' : 'Activity'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={editFormData.title}
              onChange={(e) => setEditFormData(prev => ({
                ...prev,
                title: e.target.value
              }))}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editFormData.description}
              onChange={(e) => setEditFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
            
            {/* Only show status field for regular activities */}
            {!editingActivity.isDaily && (
              <>
                <TextField
                  select
                  margin="dense"
                  label="Status"
                  fullWidth
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    status: e.target.value
                  }))}
                >
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
                
                <TextField
                  select
                  margin="dense"
                  label="Activity Type"
                  fullWidth
                  value={editFormData.activity_type || ''}
                  onChange={(e) => setEditFormData(prev => ({
                    ...prev,
                    activity_type: e.target.value
                  }))}
                >
                  {activityTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <TextField
                    margin="dense"
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editFormData.start_date ? new Date(editFormData.start_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      start_date: e.target.value ? new Date(e.target.value).toISOString() : null
                    }))}
                  />
                  <TextField
                    margin="dense"
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={editFormData.end_date ? new Date(editFormData.end_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEditFormData(prev => ({
                      ...prev,
                      end_date: e.target.value ? new Date(e.target.value).toISOString() : null
                    }))}
                  />
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingActivity(null)}>Cancel</Button>
            <Button 
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  
                  if (editingActivity.isDaily) {
                    // Handle daily activity update
                    const response = await axios.put(
                      `${base_url}/api/daily_activities/${editingActivity.daily_activity_id}`,
                      {
                        title: editFormData.title,
                        description: editFormData.description,
                        start_date: editFormData.start_date,
                        end_date: editFormData.end_date,
                        date: editFormData.date
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    setDailyActivities(prev => 
                      prev.map(activity => 
                        activity.daily_activity_id === editingActivity.daily_activity_id 
                          ? { 
                              ...activity, 
                              title: editFormData.title,
                              description: editFormData.description,
                              start_date: editFormData.start_date,
                              end_date: editFormData.end_date,
                              date: editFormData.date
                            }
                          : activity
                      )
                    );
                  } else {
                    // Handle regular activity update
                    const response = await axios.put(
                      `${base_url}/api/activities/${editingActivity.activity_id}`,
                      editFormData,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    
                    setRegularActivities(prev => 
                      prev.map(activity => 
                        activity.activity_id === editingActivity.activity_id 
                          ? { ...activity, ...editFormData }
                          : activity
                      )
                    );
                  }
                  
                  setEditingActivity(null);
                  setSnackbarMessage(`${editingActivity.isDaily ? 'Daily activity' : 'Activity'} updated successfully!`);
                  setSnackbarOpen(true);
                } catch (error) {
                  console.error('Error updating activity:', error);
                  setError(`Failed to update ${editingActivity.isDaily ? 'daily activity' : 'activity'}`);
                }
              }}
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ActivityManager;