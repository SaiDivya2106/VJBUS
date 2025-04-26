import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CloudIcon from '@mui/icons-material/Cloud';
import WebIcon from '@mui/icons-material/Web';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TimelineIcon from '@mui/icons-material/Timeline';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6106';

const CareerCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const GradientBox = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const RoadmapItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #e0e0e0',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

function CareerCopilot() {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [careerData, setCareerData] = useState({
    software_engineer: {
      title: "Software Engineer",
      description: "A professional who designs, develops, tests, and maintains software applications and systems",
      icon: <CodeIcon fontSize="large" />,
    },
    data_scientist: {
      title: "Data Scientist",
      description: "A professional who analyzes complex data sets to extract insights and build predictive models",
      icon: <TimelineIcon fontSize="large" />,
    },
    devops_engineer: {
      title: "DevOps Engineer",
      description: "A professional who combines development and operations to streamline software delivery and infrastructure management",
      icon: <CloudIcon fontSize="large" />,
    },
    full_stack_developer: {
      title: "Full Stack Developer",
      description: "A versatile developer who works with both frontend and backend technologies to build complete web applications",
      icon: <WebIcon fontSize="large" />,
    },
    mobile_developer: {
      title: "Mobile Developer",
      description: "A specialized developer who creates applications for mobile devices like smartphones and tablets",
      icon: <PhoneAndroidIcon fontSize="large" />,
    },
    data_engineer: {
      title: "Data Engineer",
      description: "A professional who designs and maintains the architecture for data generation, processing, and storage",
      icon: <StorageIcon fontSize="large" />,
    }
  });
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  const navigate = useNavigate();
  
  // Fetch user's activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingActivities(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${API_URL}/api/activities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load your activities');
      } finally {
        setLoadingActivities(false);
      }
    };
    
    fetchActivities();
  }, [navigate]);
  
  const handleSelectCareer = (career) => {
    setSelectedCareer(career);
    // Reset analysis and roadmap when changing career
    setAnalysis(null);
    setRoadmap(null);
  };
  
  const analyzeCareerGap = async () => {
    if (!selectedCareer) return;
    
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/career/analyze`,
        { target_career: selectedCareer },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error analyzing career gap:', error);
      toast.error('Failed to analyze career gap');
    } finally {
      setAnalyzing(false);
    }
  };
  
  const generateRoadmap = async () => {
    if (!selectedCareer) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/career/roadmap`,
        { target_career: selectedCareer },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setRoadmap(response.data);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
        Career Copilot
      </Typography>
      
      <Typography variant="h6" component="h2" align="center" color="text.secondary" sx={{ mb: 5 }}>
        Analyze your progress and get personalized guidance for your career journey
      </Typography>
      
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Choose Your Career Path
        </Typography>
        
        <Grid container spacing={3}>
          {Object.entries(careerData).map(([key, career]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <CareerCard 
                selected={selectedCareer === key}
                onClick={() => handleSelectCareer(key)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box mr={2} color="primary.main">
                      {career.icon}
                    </Box>
                    <Typography variant="h6" component="h3">
                      {career.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {career.description}
                  </Typography>
                </CardContent>
              </CareerCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {selectedCareer && !analysis && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={analyzeCareerGap}
            disabled={analyzing}
            startIcon={analyzing ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {analyzing ? 'Analyzing Your Progress...' : 'Analyze My Progress'}
          </Button>
        </Box>
      )}
      
      {analysis && (
        <Box mt={5}>
          <GradientBox>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Progress Towards {careerData[selectedCareer].title}
            </Typography>
            
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                Overall Progress
              </Typography>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysis.progress?.overall * 100 || 0} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(analysis.progress?.overall * 100 || 0)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Skills Progress
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.progress?.skills * 100 || 0} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(analysis.progress?.skills * 100 || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Activities Progress
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.progress?.activities * 100 || 0} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(analysis.progress?.activities * 100 || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </GradientBox>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    Missing Skills
                  </Box>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.missing_skills.map((skill, index) => (
                      <Chip key={index} label={skill} sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    You've mastered all the required skills!
                  </Typography>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    Recommended Activities
                  </Box>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {analysis.missing_activities && analysis.missing_activities.length > 0 ? (
                  <List disablePadding>
                    {analysis.missing_activities.slice(0, 4).map((activity, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText
                          primary={activity.title}
                          secondary={activity.description?.substring(0, 80) + '...'}
                        />
                      </ListItem>
                    ))}
                    {analysis.missing_activities.length > 4 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        And {analysis.missing_activities.length - 4} more...
                      </Typography>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    You've completed all the recommended activities!
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="center" mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={generateRoadmap}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={24} color="inherit" /> : <NavigateNextIcon />}
            >
              {loading ? "Generating Your Roadmap..." : "Generate Personalized Roadmap"}
            </Button>
          </Box>
        </Box>
      )}
      
      {roadmap && (
        <Box mt={5}>
          <Typography variant="h5" gutterBottom>
            Your Personalized Career Roadmap
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Based on your current skills and activities, here is a personalized roadmap to help you reach your career goals.
          </Typography>
          
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Next Steps
            </Typography>
            <List>
              {roadmap.recommendations?.next_steps?.map((step, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <Box display="flex" alignItems="center">
                    <ArrowForwardIcon color="primary" sx={{ mr: 2 }} />
                    <Typography variant="body1">{step}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recommended Projects
            </Typography>
            <Grid container spacing={2}>
              {roadmap.recommendations?.project_ideas?.map((project, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <RoadmapItem>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    {project.skills_gained && (
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {project.skills_gained.map((skill, i) => (
                          <Chip key={i} label={skill} size="small" />
                        ))}
                      </Box>
                    )}
                  </RoadmapItem>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {roadmap.recommendations?.learning_resources && roadmap.recommendations.learning_resources.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Learning Resources
              </Typography>
              <Grid container spacing={2}>
                {roadmap.recommendations.learning_resources.map((resource, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {resource.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {resource.type}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {resource.description}
                        </Typography>
                        {resource.link && (
                          <Button 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener"
                            size="small" 
                            sx={{ mt: 2 }}
                          >
                            View Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Box mt={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Timeline
            </Typography>
            <Grid container spacing={2}>
              {roadmap.recommendations?.timeline && Object.entries(roadmap.recommendations.timeline).map(([period, description], index) => (
                <Grid item xs={12} md={4} key={period}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {period.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Typography>
                    <Typography variant="body2">
                      {description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box display="flex" justifyContent="center" mt={5}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setSelectedCareer(null);
                setAnalysis(null);
                setRoadmap(null);
              }}
            >
              Start Over
            </Button>
          </Box>
        </Box>
      )}
      
    </Container>
  );
}

export default CareerCopilot; 