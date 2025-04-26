import React, { useRef, useEffect } from 'react';
import { Box, Typography, Divider, styled } from '@mui/material';
import {
  ResumeContainer,
  Section,
  ContentContainer,
  PrintStyles,
} from './styles';

// ATS-specific styled components
const ATSHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& h1': {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    fontFamily: 'Times New Roman, serif',
  },
  '& .contact-info': {
    fontSize: '14px',
    textAlign: 'center',
    '& > span': {
      margin: '0 8px',
    }
  }
}));

const ATSSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  textTransform: 'uppercase',
  borderBottom: '1px solid black',
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(0.5),
  fontFamily: 'Times New Roman, serif',
}));

const ATSExperienceItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .company-line': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
    '& .company': {
      fontWeight: 700,
      fontSize: '14px',
    },
    '& .date': {
      fontSize: '14px',
    }
  },
  '& .position': {
    fontSize: '14px',
    fontStyle: 'italic',
    marginBottom: theme.spacing(0.5),
  },
  '& .description': {
    fontSize: '14px',
    marginLeft: theme.spacing(2),
    '&:before': {
      content: '"•"',
      position: 'absolute',
      left: '-1em',
    },
    position: 'relative',
  }
}));

const ATSTemplate = ({ resumeData }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!resumeData) return;

    const adjustScale = () => {
      const content = contentRef.current;
      if (!content) return;

      if (!window.matchMedia('print').matches) {
        content.style.transform = 'scale(1)';
        const contentHeight = content.scrollHeight;
        const containerHeight = content.parentElement.clientHeight;

        if (contentHeight > containerHeight) {
          const scale = containerHeight / contentHeight;
          content.style.transform = `scale(${scale})`;
        }
      }
    };

    adjustScale();
    window.addEventListener('resize', adjustScale);
    return () => window.removeEventListener('resize', adjustScale);
  }, [resumeData]);

  if (!resumeData) {
    return (
      <ResumeContainer id="resume-preview" sx={PrintStyles}>
        <ContentContainer>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="error">No resume data available</Typography>
            <Typography variant="body2">Please try generating your resume again.</Typography>
          </Box>
        </ContentContainer>
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

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'summary':
        if (resumeData.summary === undefined || resumeData.summary === '') {
          return null;
        }
        return (
          <Section key="summary">
            <ATSSectionTitle>PROFESSIONAL SUMMARY</ATSSectionTitle>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {resumeData.summary}
            </Typography>
          </Section>
        );

      case 'experience':
        return experience && experience.length > 0 ? (
          <Section key="experience">
            <ATSSectionTitle>EXPERIENCE</ATSSectionTitle>
            {experience.map((exp, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{exp.company}</Typography>
                  <Typography className="date">{exp.period}</Typography>
                </Box>
                <Typography className="position">{exp.position}</Typography>
                {exp.description && (
                  <Typography className="description">
                    {exp.description}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        ) : null;

      case 'education':
        return education && education.length > 0 ? (
          <Section key="education">
            <ATSSectionTitle>EDUCATION</ATSSectionTitle>
            {education.map((edu, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{edu.school}</Typography>
                  <Typography className="date">{edu.period}</Typography>
                </Box>
                <Typography className="position">
                  {edu.degree} in {edu.field}
                </Typography>
                {edu.description && (
                  <Typography className="description">
                    {edu.description}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        ) : null;

      case 'skills':
        return skills && skills.length > 0 ? (
          <Section key="skills">
            <ATSSectionTitle>TECHNICAL SKILLS</ATSSectionTitle>
            <Typography sx={{ fontSize: '14px' }}>
              {skills.join(', ')}
            </Typography>
          </Section>
        ) : null;

      case 'projects':
        return projects && projects.length > 0 ? (
          <Section key="projects">
            <ATSSectionTitle>PROJECTS</ATSSectionTitle>
            {projects.map((project, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{project.title}</Typography>
                  {project.period && (
                    <Typography className="date">{project.period}</Typography>
                  )}
                </Box>
                {project.description && (
                  <Typography className="description">
                    {project.description}
                  </Typography>
                )}
                {project.skills && project.skills.length > 0 && (
                  <Typography 
                    sx={{ 
                      fontSize: '14px',
                      fontStyle: 'italic',
                      mt: 0.5 
                    }}
                  >
                    Technologies: {project.skills.join(', ')}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        ) : null;

      case 'co_curricular':
      case 'cocurricular':
        const coActivities = co_curricular || cocurricular || [];
        if (coActivities.length === 0) return null;
        return (
          <Section key="co_curricular">
            <ATSSectionTitle>CO-CURRICULAR ACTIVITIES</ATSSectionTitle>
            {coActivities.map((activity, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{activity.title}</Typography>
                  {activity.period && (
                    <Typography className="date">{activity.period}</Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography className="description">
                    {activity.description}
                  </Typography>
                )}
                {activity.skills && activity.skills.length > 0 && (
                  <Typography 
                    sx={{ 
                      fontSize: '14px',
                      fontStyle: 'italic',
                      mt: 0.5 
                    }}
                  >
                    Skills: {activity.skills.join(', ')}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        );
        
      case 'extra_curricular':
      case 'extracurricular':
        const extraActivities = extra_curricular || extracurricular || [];
        if (extraActivities.length === 0) return null;
        return (
          <Section key="extra_curricular">
            <ATSSectionTitle>EXTRA-CURRICULAR ACTIVITIES</ATSSectionTitle>
            {extraActivities.map((activity, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{activity.title}</Typography>
                  {activity.period && (
                    <Typography className="date">{activity.period}</Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography className="description">
                    {activity.description}
                  </Typography>
                )}
                {activity.skills && activity.skills.length > 0 && (
                  <Typography 
                    sx={{ 
                      fontSize: '14px',
                      fontStyle: 'italic',
                      mt: 0.5 
                    }}
                  >
                    Skills: {activity.skills.join(', ')}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        );
        
      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <Section key="certifications">
            <ATSSectionTitle>CERTIFICATIONS</ATSSectionTitle>
            {certifications.map((certification, index) => (
              <ATSExperienceItem key={index}>
                <Box className="company-line">
                  <Typography className="company">{certification.title}</Typography>
                  {certification.period && (
                    <Typography className="date">{certification.period}</Typography>
                  )}
                </Box>
                {certification.description && (
                  <Typography className="description">
                    {certification.description}
                  </Typography>
                )}
              </ATSExperienceItem>
            ))}
          </Section>
        );

      case 'custom':
        return resumeData.sections?.filter(section => 
          !['personal', 'experience', 'education', 'skills'].includes(section.id)
        ).map(section => (
          <Section key={section.id}>
            <ATSSectionTitle>{section.title.toUpperCase()}</ATSSectionTitle>
            {section.bullets.map((bullet, bulletIndex) => (
              <ATSExperienceItem key={bulletIndex}>
                <Box className="company-line">
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {bullet}
                  </Typography>
                </Box>
              </ATSExperienceItem>
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
              <ATSSectionTitle>{customSection.title.toUpperCase()}</ATSSectionTitle>
              {(customSection.bullets || []).map((bullet, bulletIndex) => (
                <ATSExperienceItem key={bulletIndex}>
                  <Box className="company-line">
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {bullet}
                    </Typography>
                  </Box>
                </ATSExperienceItem>
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
              <ATSSectionTitle>{activityType.toUpperCase()}</ATSSectionTitle>
              {activitiesOfType.map((activity, index) => (
                <ATSExperienceItem key={index}>
                  <Box className="company-line">
                    <Typography className="company">{activity.title}</Typography>
                    {activity.date && (
                      <Typography className="date">
                        {new Date(activity.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                    )}
                  </Box>
                  {activity.description && (
                    <Typography className="description">
                      {activity.description}
                    </Typography>
                  )}
                  {activity.skills && activity.skills.length > 0 && (
                    <Typography 
                      sx={{ 
                        fontSize: '14px',
                        fontStyle: 'italic',
                        mt: 0.5 
                      }}
                    >
                      Skills: {activity.skills.join(', ')}
                    </Typography>
                  )}
                </ATSExperienceItem>
              ))}
            </Section>
          );
        }
        return null;
    }
  };

  return (
    <ResumeContainer id="resume-preview" sx={PrintStyles}>
      <ContentContainer>
        <Box ref={contentRef}>
          {/* Header */}
          <ATSHeader>
            <Typography variant="h1" align="center">
              {basics.name}
            </Typography>
            <Box className="contact-info">
              <span>{basics.email}</span>
              <span>|</span>
              <span>{basics.phone}</span>
              <span>|</span>
              <span>{basics.location}</span>
              {basics.profiles?.linkedin && (
                <>
                  <span>|</span>
                  <span>LinkedIn: {basics.profiles.linkedin}</span>
                </>
              )}
              {basics.profiles?.github && (
                <>
                  <span>|</span>
                  <span>GitHub: {basics.profiles.github}</span>
                </>
              )}
            </Box>
          </ATSHeader>

          {/* Render each section based on sectionOrder */}
          {sectionOrder.map(sectionType => renderSection(sectionType))}
        </Box>
      </ContentContainer>
    </ResumeContainer>
  );
};

export default ATSTemplate; 