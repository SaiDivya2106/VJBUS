import React, { useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Alert,
  MenuItem
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LockIcon from '@mui/icons-material/Lock';
import {
  ActionButton,
  EditContainer,
  SectionPaper,
  ItemBox
} from '../../pages/ResumeBuilder.styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Define the drag type
const ItemTypes = {
  SECTION: 'section'
};

// Non-draggable section component for contact
const NonDraggableSection = ({ 
  sectionType, 
  expandedSection, 
  toggleSectionExpansion,
  children 
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <SectionPaper
        sx={{
          border: expandedSection === sectionType ? '2px solid primary.main' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <LockIcon fontSize="small" />
            </Box>
            <Typography variant="h6">
              {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => toggleSectionExpansion(sectionType)}
          >
            {expandedSection === sectionType ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
      </SectionPaper>
      {children}
    </Box>
  );
};

// Draggable section component for other sections
const DraggableSection = ({ 
  sectionType, 
  index, 
  moveSection, 
  expandedSection, 
  toggleSectionExpansion,
  displayTitle,
  children 
}) => {
  const ref = useRef(null);

  // Set up drag
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { type: ItemTypes.SECTION, id: sectionType, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Set up drop
  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveSection(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Connect drag and drop refs
  drag(drop(ref));

  return (
    <Box 
      ref={ref} 
      sx={{ 
        mb: 2, 
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move'
      }}
    >
      <SectionPaper
        sx={{
          border: expandedSection === sectionType ? '2px solid primary.main' : 'none',
          backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <DragIndicatorIcon />
            </Box>
            <Typography variant="h6">
              {displayTitle || sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => toggleSectionExpansion(sectionType)}
          >
            {expandedSection === sectionType ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Box>
      </SectionPaper>
      {children}
    </Box>
  );
};

const ResumeEditor = ({
  // Edit state
  basics,
  setBasics,
  summary,
  setSummary,
  education,
  experience,
  skills,
  setSkills,
  projects,
  setProjects,
  sections,
  sectionOrder,
  
  // Direct section data
  co_curricular,
  setCoCurricular,
  extra_curricular,
  setExtraCurricular,
  certifications,
  setCertifications,
  
  // Edit functions
  updateEducation,
  removeEducation,
  addEducation,
  updateExperience,
  removeExperience,
  addExperience,
  updateProject,
  removeProject,
  addProject,
  updateProjectSkills,
  updateSectionTitle,
  removeSection,
  addSection,
  addBulletPoint,
  updateBulletPoint,
  removeBulletPoint,
  addCustomEntry,
  updateCustomEntry,
  removeCustomEntry,
  moveSection,
  expandedSection,
  setExpandedSection,
  handleSaveChanges
}) => {
  // Toggle section expansion
  const toggleSectionExpansion = (sectionType) => {
    if (sectionType === 'custom') {
      // For custom sections, toggle between 'custom' and null
      setExpandedSection(expandedSection === 'custom' ? null : 'custom');
    } else {
      // For other sections, toggle as before
      setExpandedSection(expandedSection === sectionType ? null : sectionType);
    }
  };

  // Render contact section content
  const renderContactSection = () => (
    <ItemBox>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={basics.name || ''}
            onChange={(e) => setBasics({ ...basics, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={basics.email}
            onChange={(e) => setBasics({ ...basics, email: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={basics.phone}
            onChange={(e) => setBasics({ ...basics, phone: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={basics.profiles?.linkedin || ''}
            onChange={(e) => setBasics({
              ...basics,
              profiles: { ...basics.profiles, linkedin: e.target.value }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="GitHub"
            value={basics.profiles?.github || ''}
            onChange={(e) => setBasics({
              ...basics,
              profiles: { ...basics.profiles, github: e.target.value }
            })}
          />
        </Grid>
      </Grid>
    </ItemBox>
  );

  // Filter out contact from draggable sections
  const draggableSections = sectionOrder.filter(section => section !== 'contact');

  // Custom move section handler for draggable sections
  const handleMoveSection = (fromIndex, toIndex) => {
    // Get the actual section order indices (accounting for contact being removed)
    const fromSectionType = draggableSections[fromIndex];
    const toSectionType = draggableSections[toIndex];
    
    // Find the actual indices in the full sectionOrder array
    const fromSectionIndex = sectionOrder.findIndex(section => section === fromSectionType);
    const toSectionIndex = sectionOrder.findIndex(section => section === toSectionType);
    
    if (fromSectionIndex !== -1 && toSectionIndex !== -1) {
      // Determine direction
      if (fromSectionIndex < toSectionIndex) {
        // Moving down
        for (let i = fromSectionIndex; i < toSectionIndex; i++) {
          moveSection(i, 'down');
        }
      } else {
        // Moving up
        for (let i = fromSectionIndex; i > toSectionIndex; i--) {
          moveSection(i, 'up');
        }
      }
    }
  };

  // Update project
  const handleUpdateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    };
    setProjects(newProjects);
  };
  
  // Remove project
  const handleRemoveProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };
  
  // Add new project
  const handleAddProject = () => {
    const newProject = {
      title: '',
      description: '',
      skills: [],
      period: ''
    };
    setProjects([...projects, newProject]);
  };

  // Update certification
  const handleUpdateCertification = (index, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    };
    setCertifications(newCertifications);
  };
  
  // Remove certification
  const handleRemoveCertification = (index) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
  };
  
  // Add new certification
  const handleAddCertification = () => {
    const newCertification = {
      title: '',
      description: '',
      skills: [],
      period: ''
    };
    setCertifications([...certifications, newCertification]);
  };

  // Update co-curricular activity
  const handleUpdateCoCurricular = (index, field, value) => {
    const newCoCurricular = [...co_curricular];
    newCoCurricular[index] = {
      ...newCoCurricular[index],
      [field]: value
    };
    setCoCurricular(newCoCurricular);
  };
  
  // Remove co-curricular activity
  const handleRemoveCoCurricular = (index) => {
    const newCoCurricular = co_curricular.filter((_, i) => i !== index);
    setCoCurricular(newCoCurricular);
  };
  
  // Add new co-curricular activity
  const handleAddCoCurricular = () => {
    const newActivity = {
      title: '',
      description: '',
      skills: [],
      period: ''
    };
    setCoCurricular([...co_curricular, newActivity]);
  };

  // Update extra-curricular activity
  const handleUpdateExtraCurricular = (index, field, value) => {
    const newExtraCurricular = [...extra_curricular];
    newExtraCurricular[index] = {
      ...newExtraCurricular[index],
      [field]: value
    };
    setExtraCurricular(newExtraCurricular);
  };
  
  // Remove extra-curricular activity
  const handleRemoveExtraCurricular = (index) => {
    const newExtraCurricular = extra_curricular.filter((_, i) => i !== index);
    setExtraCurricular(newExtraCurricular);
  };
  
  // Add new extra-curricular activity
  const handleAddExtraCurricular = () => {
    const newActivity = {
      title: '',
      description: '',
      skills: [],
      period: ''
    };
    setExtraCurricular([...extra_curricular, newActivity]);
  };

  const renderProjectsSection = () => (
    <Box sx={{ pt: 2, pb: 2, display: expandedSection === 'projects' ? 'block' : 'none' }}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Edit your projects and technical work
        </Typography>
      </Box>

      {projects.map((project, index) => (
        <ItemBox key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Project Title"
                fullWidth
                value={project.title || ''}
                onChange={(e) => handleUpdateProject(index, 'title', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Period (e.g. Jan 2023 - Present)"
                fullWidth
                value={project.period || ''}
                onChange={(e) => handleUpdateProject(index, 'period', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={project.description || ''}
                onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                value={Array.isArray(project.skills) ? project.skills.join(', ') : ''}
                onChange={(e) => {
                  const skillsArr = e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s);
                  handleUpdateProject(index, 'skills', skillsArr);
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <ActionButton 
                color="error"
                onClick={() => handleRemoveProject(index)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </ActionButton>
            </Grid>
          </Grid>
        </ItemBox>
      ))}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <ActionButton
          onClick={handleAddProject}
          startIcon={<AddIcon />}
        >
          Add Project
        </ActionButton>
      </Box>
    </Box>
  );

  const renderCoCurricularSection = () => (
    <Box sx={{ pt: 2, pb: 2, display: expandedSection === 'co_curricular' ? 'block' : 'none' }}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Edit your co-curricular activities (workshops, courses, etc.)
        </Typography>
      </Box>

      {co_curricular.map((activity, index) => (
        <ItemBox key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Activity Title"
                fullWidth
                value={activity.title || ''}
                onChange={(e) => handleUpdateCoCurricular(index, 'title', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Period (e.g. Jan 2023 - Present)"
                fullWidth
                value={activity.period || ''}
                onChange={(e) => handleUpdateCoCurricular(index, 'period', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={activity.description || ''}
                onChange={(e) => handleUpdateCoCurricular(index, 'description', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                value={Array.isArray(activity.skills) ? activity.skills.join(', ') : ''}
                onChange={(e) => {
                  const skillsArr = e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s);
                  handleUpdateCoCurricular(index, 'skills', skillsArr);
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <ActionButton 
                color="error"
                onClick={() => handleRemoveCoCurricular(index)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </ActionButton>
            </Grid>
          </Grid>
        </ItemBox>
      ))}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <ActionButton
          onClick={handleAddCoCurricular}
          startIcon={<AddIcon />}
        >
          Add Co-Curricular Activity
        </ActionButton>
      </Box>
    </Box>
  );

  const renderExtraCurricularSection = () => (
    <Box sx={{ pt: 2, pb: 2, display: expandedSection === 'extra_curricular' ? 'block' : 'none' }}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Edit your extra-curricular activities (volunteering, club participation, etc.)
        </Typography>
      </Box>

      {extra_curricular.map((activity, index) => (
        <ItemBox key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Activity Title"
                fullWidth
                value={activity.title || ''}
                onChange={(e) => handleUpdateExtraCurricular(index, 'title', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Period (e.g. Jan 2023 - Present)"
                fullWidth
                value={activity.period || ''}
                onChange={(e) => handleUpdateExtraCurricular(index, 'period', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={activity.description || ''}
                onChange={(e) => handleUpdateExtraCurricular(index, 'description', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <ActionButton 
                color="error"
                onClick={() => handleRemoveExtraCurricular(index)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </ActionButton>
            </Grid>
          </Grid>
        </ItemBox>
      ))}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <ActionButton
          onClick={handleAddExtraCurricular}
          startIcon={<AddIcon />}
        >
          Add Extra-Curricular Activity
        </ActionButton>
      </Box>
    </Box>
  );

  const renderCertificationsSection = () => (
    <Box sx={{ pt: 2, pb: 2, display: expandedSection === 'certifications' ? 'block' : 'none' }}>
      <Box sx={{ pb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Edit your certifications and professional credentials
        </Typography>
      </Box>

      {certifications.map((certification, index) => (
        <ItemBox key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Certification Name"
                fullWidth
                value={certification.title || ''}
                onChange={(e) => handleUpdateCertification(index, 'title', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Period (e.g. Jan 2023)"
                fullWidth
                value={certification.period || ''}
                onChange={(e) => handleUpdateCertification(index, 'period', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={certification.description || ''}
                onChange={(e) => handleUpdateCertification(index, 'description', e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                value={Array.isArray(certification.skills) ? certification.skills.join(', ') : ''}
                onChange={(e) => {
                  const skillsArr = e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s);
                  handleUpdateCertification(index, 'skills', skillsArr);
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <ActionButton 
                color="error"
                onClick={() => handleRemoveCertification(index)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </ActionButton>
            </Grid>
          </Grid>
        </ItemBox>
      ))}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <ActionButton
          onClick={handleAddCertification}
          startIcon={<AddIcon />}
        >
          Add Certification
        </ActionButton>
      </Box>
    </Box>
  );

  // Render a specific custom section content
  const renderCustomSectionContent = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return null;
    
    return (
      <Box>
        <Box sx={{ pb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Edit your custom section
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Section Title"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>
        
        {/* Custom section entries - simplified to just points */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Points:
          </Typography>
          
          {(section.entries || []).map((entry, entryIndex) => (
            <ItemBox key={entryIndex} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography sx={{ mr: 1 }}>•</Typography>
                <TextField
                  fullWidth
                  label="Point"
                  value={entry.title || ''}
                  onChange={(e) => updateCustomEntry(section.id, entryIndex, 'title', e.target.value)}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                />
                <IconButton 
                  color="error"
                  onClick={() => removeCustomEntry(section.id, entryIndex)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ItemBox>
          ))}
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <ActionButton
            variant="contained"
            onClick={() => {
              const newEntry = {
                title: '',
                period: '',
                description: '',
                skills: []
              };
              addCustomEntry(section.id);
            }}
            startIcon={<AddIcon />}
          >
            Add Point
          </ActionButton>
          
          <ActionButton
            variant="outlined"
            color="error"
            onClick={() => removeSection(section.id)}
            startIcon={<DeleteIcon />}
          >
            Remove Section
          </ActionButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="edit-section">
      <EditContainer>
        {/* Non-draggable contact section always at the top */}
        <NonDraggableSection
          sectionType="contact"
          expandedSection={expandedSection}
          toggleSectionExpansion={toggleSectionExpansion}
        >
          {expandedSection === 'contact' && renderContactSection()}
        </NonDraggableSection>

        {/* Draggable sections */}
        <DndProvider backend={HTML5Backend}>
          {draggableSections.map((sectionType, index) => {
            // For custom section IDs (starting with 'custom-'), get the section object
            const isCustomSection = sectionType.startsWith('custom-');
            const customSection = isCustomSection ? sections.find(s => s.id === sectionType) : null;
            const displayTitle = isCustomSection && customSection ? customSection.title : sectionType.charAt(0).toUpperCase() + sectionType.slice(1);
            
            return (
              <DraggableSection
                key={`section-${sectionType}`}
                sectionType={sectionType}
                index={index}
                moveSection={handleMoveSection}
                expandedSection={expandedSection}
                toggleSectionExpansion={toggleSectionExpansion}
                displayTitle={displayTitle}
              >
                {expandedSection === sectionType && (
                  <ItemBox>
                    {sectionType === 'summary' && (
                      <ItemBox>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={6}
                              label="Professional Summary"
                              value={summary}
                              onChange={(e) => setSummary(e.target.value)}
                              placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
                              helperText="Tip: Keep your summary concise, focused, and tailored to your target role"
                            />
                          </Grid>
                        </Grid>
                      </ItemBox>
                    )}

                    {sectionType === 'experience' && (
                      <>
                        {experience.map((exp, expIndex) => (
                          <ItemBox key={expIndex}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Company"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Position"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Start Date"
                                  value={exp.start_date}
                                  onChange={(e) => updateExperience(expIndex, 'start_date', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <TextField
                                    fullWidth
                                    label="End Date"
                                    value={exp.end_date}
                                    disabled={exp.current}
                                    onChange={(e) => updateExperience(expIndex, 'end_date', e.target.value)}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={exp.current}
                                        onChange={(e) => updateExperience(expIndex, 'current', e.target.checked)}
                                      />
                                    }
                                    label="Current"
                                    sx={{ ml: 1 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={4}
                                  label="Description"
                                  value={exp.description}
                                  onChange={(e) => updateExperience(expIndex, 'description', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <ActionButton
                                variant="outlined"
                                color="error"
                                onClick={() => removeExperience(expIndex)}
                              >
                                Remove
                              </ActionButton>
                            </Box>
                          </ItemBox>
                        ))}
                        <Box sx={{ mt: 2 }}>
                          <ActionButton
                            variant="contained"
                            onClick={addExperience}
                          >
                            Add Experience
                          </ActionButton>
                        </Box>
                      </>
                    )}

                    {sectionType === 'education' && (
                      <>
                        {education.map((edu, eduIndex) => (
                          <ItemBox key={eduIndex}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="School"
                                  value={edu.school}
                                  onChange={(e) => updateEducation(eduIndex, 'school', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Degree"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Field of Study"
                                  value={edu.field}
                                  onChange={(e) => updateEducation(eduIndex, 'field', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Start Year"
                                  value={edu.start_year}
                                  onChange={(e) => updateEducation(eduIndex, 'start_year', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <TextField
                                    fullWidth
                                    label="End Year"
                                    value={edu.end_year}
                                    disabled={edu.current}
                                    onChange={(e) => updateEducation(eduIndex, 'end_year', e.target.value)}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={edu.current}
                                        onChange={(e) => updateEducation(eduIndex, 'current', e.target.checked)}
                                      />
                                    }
                                    label="Current"
                                    sx={{ ml: 1 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  label="Description"
                                  value={edu.description}
                                  onChange={(e) => updateEducation(eduIndex, 'description', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <ActionButton
                                variant="outlined"
                                color="error"
                                onClick={() => removeEducation(eduIndex)}
                              >
                                Remove
                              </ActionButton>
                            </Box>
                          </ItemBox>
                        ))}
                        <Box sx={{ mt: 2 }}>
                          <ActionButton
                            variant="contained"
                            onClick={addEducation}
                          >
                            Add Education
                          </ActionButton>
                        </Box>
                      </>
                    )}

                    {sectionType === 'skills' && (
                      <>
                        {skills.map((skill, skillIndex) => (
                          <ItemBox key={skillIndex}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Skill"
                                  value={skill}
                                  onChange={(e) => {
                                    const newSkills = [...skills];
                                    newSkills[skillIndex] = e.target.value;
                                    setSkills(newSkills);
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <ActionButton
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                  const newSkills = skills.filter((_, i) => i !== skillIndex);
                                  setSkills(newSkills);
                                }}
                              >
                                Remove
                              </ActionButton>
                            </Box>
                          </ItemBox>
                        ))}
                        <Box sx={{ mt: 2 }}>
                          <ActionButton
                            variant="contained"
                            onClick={() => setSkills([...skills, ''])}
                          >
                            Add Skill
                          </ActionButton>
                        </Box>
                      </>
                    )}

                    {sectionType === 'projects' && renderProjectsSection()}
                    
                    {sectionType === 'certifications' && renderCertificationsSection()}
                    
                    {sectionType === 'co_curricular' && renderCoCurricularSection()}
                    
                    {sectionType === 'extra_curricular' && renderExtraCurricularSection()}

                    {/* Render custom section content for sections starting with 'custom-' */}
                    {sectionType.startsWith('custom-') && renderCustomSectionContent(sectionType)}
                    
                    {/* The 'custom' section now just shows a button to add more custom sections */}
                    {sectionType === 'custom' && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          Add custom sections to your resume to highlight additional information
                        </Typography>
                        <ActionButton
                          variant="contained"
                          onClick={() => {
                            addSection();
                            // No need to expand 'custom' anymore, as individual sections are created
                          }}
                          startIcon={<AddIcon />}
                        >
                          Add Custom Section
                        </ActionButton>
                      </Box>
                    )}
                  </ItemBox>
                )}
              </DraggableSection>
            );
          })}
        </DndProvider>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ minWidth: '200px' }}
          >
            Save Changes
          </ActionButton>
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <ActionButton
            variant="outlined"
            color="primary"
            onClick={() => {
              const newSectionId = addSection();
              // After adding a section, expand it immediately
              setExpandedSection(newSectionId);
            }}
            startIcon={<AddIcon />}
            sx={{ minWidth: '200px' }}
          >
            Add Custom Section
          </ActionButton>
        </Box>
      </EditContainer>
    </Box>
  );
};

export default ResumeEditor; 