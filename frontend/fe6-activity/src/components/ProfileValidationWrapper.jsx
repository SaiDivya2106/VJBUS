import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box, 
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonIcon from '@mui/icons-material/Person';
import Profile from './Profile';

const base_url = import.meta.env.VITE_API_BASE_URL;

const ProfileValidationWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const validateProfileData = (userData) => {
    if (!userData) return false;
    
    // Check for minimal required fields
    const hasName = userData.name && userData.name.trim() !== '';
    const hasEducation = userData.education && userData.education.length > 0;
    
    // Education is now mandatory, plus name
    return hasName && hasEducation;
  };
  
  const handleClick = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${base_url}/api/user/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const isProfileComplete = validateProfileData(response.data);
      
      if (isProfileComplete) {
        // Profile is complete, navigate to resume builder
        navigate('/resume-builder');
      } else {
        // Profile is incomplete, show warning
        setShowProfileAlert(true);
      }
    } catch (error) {
      console.error('Error validating profile before navigation:', error);
      // If there's an error, let them navigate anyway
      navigate('/resume-builder');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenProfile = () => {
    setIsProfileOpen(true);
    setShowProfileAlert(false);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };
  
  // Clone the child element with the new onClick handler
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onClick: handleClick });
    }
    return child;
  });

  return (
    <>
      {childrenWithProps}
      
      {/* Profile Validation Alert */}
      <Dialog
        open={showProfileAlert}
        onClose={() => navigate('/dashboard')}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Complete Your Profile First
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" paragraph>
            To create an effective resume, you need to complete your profile with at least the following information:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" sx={{ fontWeight: 'bold' }}>Your full name (required)</Typography>
            <Typography component="li" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              At least one education entry (required) - THIS IS MANDATORY
            </Typography>
          </Box>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'error.light', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'error.main' 
          }}>
            <Typography variant="body2" fontWeight="bold">
              IMPORTANT: You must know that adding at least one education entry is absolutely required to create a resume. 
              Without education details, you cannot proceed to the Resume Builder.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenProfile}
            startIcon={<PersonIcon />}
          >
            Update Profile Now
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Profile Component */}
      <Profile 
        open={isProfileOpen} 
        onClose={handleCloseProfile} 
      />
    </>
  );
};

export default ProfileValidationWrapper; 