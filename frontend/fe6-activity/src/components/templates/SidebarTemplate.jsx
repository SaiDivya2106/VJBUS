import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, styled } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios';
import {
  ResumeContainer,
  Section,
  ContentContainer,
  ProfileImageContainer
} from './styles';

const base_url = import.meta.env.VITE_API_BASE_URL;

const SidebarTemplate = ({ resumeData }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${base_url}/api/user/profile/image`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data && response.data.base64_image) {
          setProfileImage(response.data.base64_image);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  // Process the image similar to Profile.jsx if it's a base64 string
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    if (profileImage) {
      try {
        // Create image URL from base64
        setImageUrl(`data:image/jpeg;base64,${profileImage}`);
      } catch (error) {
        console.error('Error processing profile image:', error);
        setImageUrl(null);
      }
    } else {
      setImageUrl(null);
    }
  }, [profileImage]);

  if (!resumeData) {
    return (
      <ResumeContainer id="resume-preview">
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="error">No resume data available</Typography>
          <Typography variant="body2">Please try generating your resume again.</Typography>
        </Box>
      </ResumeContainer>
    );
  }

  const { 
    basics = {}, 
    education = [], 
    experience = [], 
    skills = [], 
    projects = [], 
    co_curricular = [], 
    extra_curricular = [],
    cocurricular = [], // For backward compatibility
    extracurricular = [], // For backward compatibility
    certifications = [], // Get certifications directly from resumeData
    sectionOrder = [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'co_curricular',
      'extra_curricular',
      'certifications',
      'custom'
    ]
  } = resumeData;
  
  // Group activities by type
  const getActivitiesByType = (type) => {
    if (!Array.isArray(resumeData.activities)) return [];
    
    return resumeData.activities.filter(activity => 
      activity.activity_type?.toLowerCase() === type.toLowerCase()
    );
  };
  
  // No longer need to get certifications from activities

  // Function to render skill level bars instead of dots for better visibility
  const renderSkillLevel = (level) => {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 3, 
        bgcolor: 'rgba(255,255,255,0.2)', 
        borderRadius: 1,
        mt: 0.5
      }}>
        <Box sx={{ 
          width: `${(level/5) * 100}%`, 
          height: '100%', 
          bgcolor: 'white',
          borderRadius: 1
        }} />
      </Box>
    );
  };

  // Function to render different sections based on section type
  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'summary':
        // Only render the summary section if there's actual content
        if (resumeData.summary === undefined || resumeData.summary === '') {
          return null;
        }
        return (
          <Section key="summary">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              PROFESSIONAL SUMMARY
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {resumeData.summary}
            </Typography>
          </Section>
        );
      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <Section key="experience">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              PROFESSIONAL EXPERIENCE
            </Typography>
            {experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {exp.position}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {exp.company} • {exp.period}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Section>
        );
      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <Section key="education">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              EDUCATION
            </Typography>
            {education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {edu.school} • {edu.period}
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {edu.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Section>
        );
      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <Section key="projects">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              PROJECTS
            </Typography>
            {projects.map((project, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {project.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {project.period}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {project.description}
                </Typography>
                {project.skills && project.skills.length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Skills: {project.skills.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Section>
        );
      case 'co_curricular':
      case 'cocurricular':
        const coActivities = co_curricular || cocurricular || [];
        if (coActivities.length === 0) return null;
        return (
          <Section key="co_curricular">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              CO-CURRICULAR ACTIVITIES
            </Typography>
            {coActivities.map((activity, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {activity.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {activity.period}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {activity.description}
                </Typography>
                {activity.skills && activity.skills.length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Skills: {activity.skills.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Section>
        );
      case 'extra_curricular':
      case 'extracurricular':
        const extraActivities = extra_curricular || extracurricular || [];
        if (extraActivities.length === 0) return null;
        return (
          <Section key="extra_curricular">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              EXTRA-CURRICULAR ACTIVITIES
            </Typography>
            {extraActivities.map((activity, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {activity.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  {activity.period}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {activity.description}
                </Typography>
                {activity.skills && activity.skills.length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Skills: {activity.skills.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Section>
        );
      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <Section key="certifications">
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              CERTIFICATIONS
            </Typography>
            {certifications.map((certification, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {certification.title}
                </Typography>
                {certification.period && (
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    {certification.period}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {certification.description}
                </Typography>
              </Box>
            ))}
          </Section>
        );
      case 'custom':
        const customSections = resumeData.sections?.filter(section => 
          !['personal', 'experience', 'education', 'skills'].includes(section.id)
        );
        if (!customSections || customSections.length === 0) return null;
        return customSections.map(section => (
          <Section key={section.id}>
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid #006989',
              pb: 0.5,
              color: '#006989',
              fontSize: '1rem'
            }}>
              {section.title}
            </Typography>
            {section.bullets.map((bullet, bulletIndex) => (
              <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    lineHeight: 1.4
                  }}
                >
                  {bullet}
                </Typography>
              </Box>
            ))}
          </Section>
        ));
      default:
        // Check if it's a custom section (starting with 'custom-')
        if (sectionType.startsWith('custom-')) {
          // Find the specific custom section by ID
          const customSection = resumeData.sections?.find(section => section.id === sectionType);
          if (!customSection) return null;
          
          return (
            <Section key={customSection.id}>
              <Typography variant="h6" sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                borderBottom: '2px solid #006989',
                pb: 0.5,
                color: '#006989',
                fontSize: '1rem'
              }}>
                {customSection.title}
              </Typography>
              {(customSection.bullets || []).map((bullet, bulletIndex) => (
                <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      lineHeight: 1.4
                    }}
                  >
                    {bullet}
                  </Typography>
                </Box>
              ))}
            </Section>
          );
        }
        
        // Check if it's a custom activity type section
        if (sectionType.startsWith('activity_type_')) {
          const activityType = sectionType.replace('activity_type_', '');
          const activitiesOfType = getActivitiesByType(activityType);
          
          if (activitiesOfType.length === 0) return null;
          
          return (
            <Section key={sectionType}>
              <Typography variant="h6" sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                borderBottom: '2px solid #006989',
                pb: 0.5,
                color: '#006989',
                fontSize: '1rem'
              }}>
                {activityType.toUpperCase()}
              </Typography>
              {activitiesOfType.map((activity, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                  {activity.date && (
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                      {new Date(activity.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {activity.description}
                  </Typography>
                  {activity.skills && activity.skills.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Skills: {activity.skills.join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Section>
          );
        }
        return null;
    }
  };

  return (
    <ResumeContainer id="resume-preview">
      <Box sx={{ 
        display: 'flex', 
        minHeight: '10in',
        maxHeight: '10in',
        overflow: 'hidden',
        '@media print': {
          minHeight: '10in',
          maxHeight: 'none',
          overflow: 'visible'
        }
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: '30%', 
          bgcolor: '#006989', 
          color: 'white',
          p: 2,
          overflow: 'hidden',
          '@media print': {
            overflow: 'visible'
          }
        }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <ProfileImageContainer sx={{ mb: 1, mx: 'auto' }}>
              <Avatar
                src={imageUrl || ''}
                alt={basics.name || 'Profile'}
                sx={{
                  width: 120,
                  height: 120,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  bgcolor: '#e0e0e0'
                }}
              />
            </ProfileImageContainer>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {basics.name}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{basics.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{basics.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{basics.location}</Typography>
            </Box>
            {basics.profiles?.linkedin && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinkedInIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{basics.profiles.linkedin}</Typography>
              </Box>
            )}
            {basics.profiles?.github && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GitHubIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{basics.profiles.github}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 'bold',
              borderBottom: '2px solid white',
              pb: 0.5
            }}>
              SKILLS
            </Typography>
            {skills.map((skill, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {skill}
                </Typography>
                {renderSkillLevel(5)}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          width: '70%', 
          p: 2,
          overflow: 'auto',
          '@media print': {
            overflow: 'visible'
          }
        }}>
          {sectionOrder.filter(section => section !== 'skills').map(sectionType => renderSection(sectionType))}
        </Box>
      </Box>
    </ResumeContainer>
  );
};

export default SidebarTemplate; 