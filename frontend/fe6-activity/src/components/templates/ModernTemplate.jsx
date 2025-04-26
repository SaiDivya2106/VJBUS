import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import {
  ResumeContainer,
  Section,
  ModernSectionTitle,
  ModernHeader,
  ExperienceItem,
  SkillsContainer,
  ProjectItem,
  PrintStyles,
  ContentContainer
} from './styles';

const ModernTemplate = ({ resumeData }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!resumeData) return;

    // Function to adjust content scale if it overflows
    const adjustScale = () => {
      const content = contentRef.current;
      if (!content) return;

      // Only adjust scale in preview mode, not when printing
      if (!window.matchMedia('print').matches) {
        // Reset scale to measure true height
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
    certifications = [], // Now directly from resumeData
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
  
  // Group activities by type for custom activity types
  const getActivitiesByType = (type) => {
    if (!Array.isArray(resumeData.activities)) return [];
    
    return resumeData.activities.filter(activity => 
      activity.activity_type?.toLowerCase() === type.toLowerCase()
    );
  };

  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'summary':
        // Only render the summary section if there's actual content
        if (resumeData.summary === undefined || resumeData.summary === '') {
          return null;
        }
        return (
          <Section key="summary">
            <ModernSectionTitle>Professional Summary</ModernSectionTitle>
            <Typography variant="body2" sx={{ lineHeight: 1.5, color: 'text.primary' }}>
              {resumeData.summary}
            </Typography>
          </Section>
        );
      case 'experience':
        return (
          <Section key="experience">
            <ModernSectionTitle>Professional Experience</ModernSectionTitle>
            {experience.map((exp, index) => (
              <ExperienceItem key={index}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {exp.position}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {exp.company} • {exp.period}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {exp.description}
                  </Typography>
                )}
              </ExperienceItem>
            ))}
          </Section>
        );
      case 'education':
        return (
          <Section key="education">
            <ModernSectionTitle>Education</ModernSectionTitle>
            {education.map((edu, index) => (
              <ExperienceItem key={index}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {edu.degree} in {edu.field}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {edu.school} • {edu.period}
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {edu.description}
                  </Typography>
                )}
              </ExperienceItem>
            ))}
          </Section>
        );
      case 'skills':
        return (
          <Section key="skills">
            <ModernSectionTitle>Technical Skills</ModernSectionTitle>
            <SkillsContainer>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </SkillsContainer>
          </Section>
        );
      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <Section key="projects">
            <ModernSectionTitle>Projects</ModernSectionTitle>
            {projects.map((project, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {project.title}
                  </Typography>
                  {project.period && (
                    <Typography variant="body2" color="textSecondary">
                      {project.period}
                    </Typography>
                  )}
                </Box>
                {project.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {project.description}
                  </Typography>
                )}
                {project.skills && project.skills.length > 0 && (
                  <SkillsContainer sx={{ mt: 0.5 }}>
                    {project.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ m: 0.25 }}
                      />
                    ))}
                  </SkillsContainer>
                )}
              </ProjectItem>
            ))}
          </Section>
        );
      case 'co_curricular':
      case 'cocurricular':
        const coActivities = co_curricular || cocurricular || [];
        if (coActivities.length === 0) return null;
        return (
          <Section key="co_curricular">
            <ModernSectionTitle>Co-Curricular Activities</ModernSectionTitle>
            {coActivities.map((activity, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                  {activity.period && (
                    <Typography variant="body2" color="textSecondary">
                      {activity.period}
                    </Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {activity.description}
                  </Typography>
                )}
                {activity.skills && activity.skills.length > 0 && (
                  <SkillsContainer sx={{ mt: 0.5 }}>
                    {activity.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ m: 0.25 }}
                      />
                    ))}
                  </SkillsContainer>
                )}
              </ProjectItem>
            ))}
          </Section>
        );
      case 'extra_curricular':
      case 'extracurricular':
        const extraActivities = extra_curricular || extracurricular || [];
        if (extraActivities.length === 0) return null;
        return (
          <Section key="extra_curricular">
            <ModernSectionTitle>Extra-Curricular Activities</ModernSectionTitle>
            {extraActivities.map((activity, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                  {activity.period && (
                    <Typography variant="body2" color="textSecondary">
                      {activity.period}
                    </Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {activity.description}
                  </Typography>
                )}
                {activity.skills && activity.skills.length > 0 && (
                  <SkillsContainer sx={{ mt: 0.5 }}>
                    {activity.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ m: 0.25 }}
                      />
                    ))}
                  </SkillsContainer>
                )}
              </ProjectItem>
            ))}
          </Section>
        );
      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <Section key="certifications">
            <ModernSectionTitle>Certifications</ModernSectionTitle>
            {certifications.map((certification, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {certification.title}
                  </Typography>
                  {certification.period && (
                    <Typography variant="body2" color="textSecondary">
                      {certification.period}
                    </Typography>
                  )}
                </Box>
                {certification.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                    {certification.description}
                  </Typography>
                )}
              </ProjectItem>
            ))}
          </Section>
        );
      case 'custom':
        return resumeData.sections?.filter(section => 
          !['personal', 'experience', 'education', 'skills'].includes(section.id)
        ).map(section => (
          <Section key={section.id}>
            <ModernSectionTitle>{section.title}</ModernSectionTitle>
            {section.bullets.map((bullet, bulletIndex) => (
              <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.primary',
                    lineHeight: 1.5
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
              <ModernSectionTitle>{customSection.title}</ModernSectionTitle>
              {(customSection.bullets || []).map((bullet, bulletIndex) => (
                <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.5
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
              <ModernSectionTitle>{activityType.charAt(0).toUpperCase() + activityType.slice(1)}</ModernSectionTitle>
              {activitiesOfType.map((activity, index) => (
                <ProjectItem key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {activity.title}
                    </Typography>
                    {activity.date && (
                      <Typography variant="body2" color="textSecondary">
                        {new Date(activity.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                    )}
                  </Box>
                  {activity.description && (
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary' }}>
                      {activity.description}
                    </Typography>
                  )}
                  {activity.skills && activity.skills.length > 0 && (
                    <SkillsContainer sx={{ mt: 0.5 }}>
                      {activity.skills.map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ m: 0.25 }}
                        />
                      ))}
                    </SkillsContainer>
                  )}
                </ProjectItem>
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
          {/* Header Section */}
          <ModernHeader>
            <Typography variant="h4" gutterBottom>
              {basics.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {basics.email} • {basics.location}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {basics.profiles.linkedin && (
                <Typography variant="body2" color="textSecondary">
                  LinkedIn: {basics.profiles.linkedin}
                </Typography>
              )}
              {basics.profiles.github && (
                <Typography variant="body2" color="textSecondary">
                  GitHub: {basics.profiles.github}
                </Typography>
              )}
            </Box>
          </ModernHeader>

          <Divider sx={{ mb: 2 }} />

          {/* Render sections in order */}
          {sectionOrder.map((sectionType, index) => (
            <React.Fragment key={sectionType}>
              {renderSection(sectionType)}
              {index < sectionOrder.length - 1 && renderSection(sectionType) && <Divider sx={{ my: 1.5 }} />}
            </React.Fragment>
          ))}
        </Box>
      </ContentContainer>
    </ResumeContainer>
  );
};

export default ModernTemplate; 