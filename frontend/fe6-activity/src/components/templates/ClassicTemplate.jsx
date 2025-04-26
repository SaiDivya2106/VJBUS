import React, { useEffect, useRef } from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import {
  ResumeContainer,
  Section,
  ClassicSectionTitle,
  ClassicHeader,
  ExperienceItem,
  SkillsContainer,
  ProjectItem,
  PrintStyles,
  ContentContainer
} from './styles';

const ClassicTemplate = ({ resumeData }) => {
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
          <Section key="summary" sx={{ mb: 1.5 }}>
            <ClassicSectionTitle>Professional Summary</ClassicSectionTitle>
            <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
              {resumeData.summary}
            </Typography>
          </Section>
        );
      case 'experience':
        return (
          <Section key="experience">
            <ClassicSectionTitle>Professional Experience</ClassicSectionTitle>
            {experience.map((exp, index) => (
              <ExperienceItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {exp.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.period}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {exp.position}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
            <ClassicSectionTitle>Education</ClassicSectionTitle>
            {education.map((edu, index) => (
              <ExperienceItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {edu.school}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.period}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {edu.degree} in {edu.field}
                </Typography>
                {edu.description && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
            <ClassicSectionTitle>Technical Skills</ClassicSectionTitle>
            <SkillsContainer>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '4px',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </SkillsContainer>
          </Section>
        );
      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <Section key="projects">
            <ClassicSectionTitle>Projects</ClassicSectionTitle>
            {projects.map((project, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {project.title}
                  </Typography>
                  {project.period && (
                    <Typography variant="body2" color="text.secondary">
                      {project.period}
                    </Typography>
                  )}
                </Box>
                {project.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
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
                        variant="outlined"
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
            <ClassicSectionTitle>Co-Curricular Activities</ClassicSectionTitle>
            {coActivities.map((activity, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                  {activity.period && (
                    <Typography variant="body2" color="text.secondary">
                      {activity.period}
                    </Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
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
                        variant="outlined"
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
            <ClassicSectionTitle>Extra-Curricular Activities</ClassicSectionTitle>
            {extraActivities.map((activity, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {activity.title}
                  </Typography>
                  {activity.period && (
                    <Typography variant="body2" color="text.secondary">
                      {activity.period}
                    </Typography>
                  )}
                </Box>
                {activity.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
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
                        variant="outlined"
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
            <ClassicSectionTitle>Certifications</ClassicSectionTitle>
            {certifications.map((certification, index) => (
              <ProjectItem key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {certification.title}
                  </Typography>
                  {certification.period && (
                    <Typography variant="body2" color="text.secondary">
                      {certification.period}
                    </Typography>
                  )}
                </Box>
                {certification.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
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
          <React.Fragment key={section.id}>
            <Section>
              <ClassicSectionTitle>{section.title}</ClassicSectionTitle>
              {section.bullets.map((bullet, bulletIndex) => (
                <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.4
                    }}
                  >
                    {bullet}
                  </Typography>
                </Box>
              ))}
            </Section>
          </React.Fragment>
        ));
      default:
        // Check if it's a custom section (starting with 'custom-')
        if (sectionType.startsWith('custom-')) {
          // Find the specific custom section by ID
          const customSection = resumeData.sections?.find(section => section.id === sectionType);
          if (!customSection) return null;
          
          return (
            <React.Fragment key={customSection.id}>
              <Section>
                <ClassicSectionTitle>{customSection.title}</ClassicSectionTitle>
                {(customSection.bullets || []).map((bullet, bulletIndex) => (
                  <Box key={bulletIndex} sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.4
                      }}
                    >
                      {bullet}
                    </Typography>
                  </Box>
                ))}
              </Section>
            </React.Fragment>
          );
        }
        
        // Check if it's a custom activity type section
        if (sectionType.startsWith('activity_type_')) {
          const activityType = sectionType.replace('activity_type_', '');
          const activitiesOfType = getActivitiesByType(activityType);
          
          if (activitiesOfType.length === 0) return null;
          
          return (
            <Section key={sectionType}>
              <ClassicSectionTitle>{activityType.charAt(0).toUpperCase() + activityType.slice(1)}</ClassicSectionTitle>
              {activitiesOfType.map((activity, index) => (
                <ProjectItem key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {activity.title}
                    </Typography>
                    {activity.date && (
                      <Typography variant="body2" color="text.secondary">
                        {new Date(activity.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                    )}
                  </Box>
                  {activity.description && (
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
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
                          variant="outlined"
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
          <ClassicHeader>
            <Typography variant="h3">
              {basics.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1,
              flexWrap: 'wrap',
              color: 'text.secondary',
              fontSize: '0.9rem'
            }}>
              <Typography>{basics.email}</Typography>
              <Typography>•</Typography>
              <Typography>{basics.location}</Typography>
              {basics.profiles?.linkedin && (
                <>
                  <Typography>•</Typography>
                  <Typography>LinkedIn: {basics.profiles.linkedin}</Typography>
                </>
              )}
              {basics.profiles?.github && (
                <>
                  <Typography>•</Typography>
                  <Typography>GitHub: {basics.profiles.github}</Typography>
                </>
              )}
            </Box>
          </ClassicHeader>

          <Divider sx={{ mb: 1.5 }} />

          {/* Render sections with reduced spacing */}
          {sectionOrder.map((sectionType, index) => (
            <React.Fragment key={sectionType}>
              {renderSection(sectionType)}
              {index < sectionOrder.length - 1 && <Divider sx={{ my: 1.5 }} />}
            </React.Fragment>
          ))}
        </Box>
      </ContentContainer>
    </ResumeContainer>
  );
};

export default ClassicTemplate; 