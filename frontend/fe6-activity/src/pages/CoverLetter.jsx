import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

// Get the API base URL from environment variables
const base_url = import.meta.env.VITE_API_BASE_URL;

// Define cache keys
const COVER_LETTER_CACHE_KEY = 'cover_letter_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}));

const CoverLetterPreview = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  minHeight: '600px',
  width: '100%',
  backgroundColor: 'white',
  position: 'relative',
  fontFamily: '"Times New Roman", Times, serif',
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  '@media print': {
    boxShadow: 'none',
    margin: 0,
    padding: theme.spacing(4),
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const CoverLetter = () => {
  // State for form fields
  const [jobDescription, setJobDescription] = useState(() => {
    const cachedData = localStorage.getItem(COVER_LETTER_CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        return parsedData.jobDescription || '';
      } catch (error) {
        console.error('Error parsing cached cover letter data:', error);
        return '';
      }
    }
    return '';
  });

  const [jobTitle, setJobTitle] = useState(() => {
    const cachedData = localStorage.getItem(COVER_LETTER_CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        return parsedData.jobTitle || '';
      } catch (error) {
        return '';
      }
    }
    return '';
  });

  const [companyName, setCompanyName] = useState(() => {
    const cachedData = localStorage.getItem(COVER_LETTER_CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        return parsedData.companyName || '';
      } catch (error) {
        return '';
      }
    }
    return '';
  });
  
  // State for cover letter content
  const [coverLetterContent, setCoverLetterContent] = useState(() => {
    const cachedData = localStorage.getItem(COVER_LETTER_CACHE_KEY);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        return parsedData.coverLetterContent || '';
      } catch (error) {
        return '';
      }
    }
    return '';
  });

  const [isEditable, setIsEditable] = useState(false);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Reference for the cover letter content for PDF generation
  const coverLetterRef = useRef(null);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    const saveToCache = () => {
      try {
        const cacheData = {
          jobDescription,
          jobTitle,
          companyName,
          coverLetterContent,
          timestamp: Date.now()
        };
        localStorage.setItem(COVER_LETTER_CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Error saving cover letter data to cache:', error);
      }
    };

    // Only save if we have meaningful data
    if (jobDescription || jobTitle || companyName || coverLetterContent) {
      saveToCache();
    }
  }, [jobDescription, jobTitle, companyName, coverLetterContent]);

  // Function to handle form submission and generate cover letter
  const handleGenerateCoverLetter = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!jobDescription.trim()) {
      setError('Job description is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${base_url}/api/generate-cover-letter`,
        {
          job_description: jobDescription,
          job_title: jobTitle,
          company_name: companyName
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCoverLetterContent(response.data.cover_letter);
      setIsEditable(false);
      setSuccessMessage('Cover letter generated successfully!');
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError(
        err.response?.data?.error || 
        'Failed to generate cover letter. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to make the cover letter content editable
  const handleEdit = () => {
    setIsEditable(true);
  };
  
  // Function to copy cover letter to clipboard
  const handleCopy = () => {
    if (coverLetterContent) {
      navigator.clipboard.writeText(coverLetterContent);
      setSuccessMessage('Cover letter copied to clipboard!');
    }
  };
  
  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    if (!coverLetterRef.current) return;
    
    try {
      setIsLoading(true);
      
      const canvas = await html2canvas(coverLetterRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: 'white',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Cover_Letter_${companyName ? companyName.replace(/\s+/g, '_') : 'Generated'}.pdf`);
      
      setSuccessMessage('Cover letter downloaded as PDF!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to clear all data
  const handleClearData = () => {
    setJobDescription('');
    setJobTitle('');
    setCompanyName('');
    setCoverLetterContent('');
    localStorage.removeItem(COVER_LETTER_CACHE_KEY);
    setSuccessMessage('All data cleared!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Cover Letter Generator
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Job Details
              </Typography>
              
              {(jobDescription || jobTitle || companyName || coverLetterContent) && (
                <Button 
                  size="small" 
                  color="error" 
                  variant="outlined" 
                  onClick={handleClearData}
                >
                  Clear All
                </Button>
              )}
            </Box>
            <form onSubmit={handleGenerateCoverLetter}>
              <TextField
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="Enter the company name"
              />
              <TextField
                label="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="Enter the job title"
              />
              <TextField
                label="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                fullWidth
                multiline
                rows={10}
                margin="normal"
                required
                placeholder="Paste the job description here"
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={isLoading || !jobDescription.trim()}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Cover Letter'}
              </Button>
            </form>
          </StyledPaper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Cover Letter
            </Typography>
            
            {coverLetterContent ? (
              <>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="Edit Cover Letter">
                    <ActionButton 
                      variant="outlined" 
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                    >
                      Edit
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Copy to Clipboard">
                    <ActionButton 
                      variant="outlined" 
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopy}
                    >
                      Copy
                    </ActionButton>
                  </Tooltip>
                  <Tooltip title="Download as PDF">
                    <ActionButton 
                      variant="contained" 
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadPDF}
                      disabled={isLoading}
                    >
                      Download PDF
                    </ActionButton>
                  </Tooltip>
                </Box>
                
                <CoverLetterPreview ref={coverLetterRef}>
                  {isEditable ? (
                    <TextField
                      value={coverLetterContent}
                      onChange={(e) => setCoverLetterContent(e.target.value)}
                      multiline
                      fullWidth
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        style: { 
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                        }
                      }}
                    />
                  ) : (
                    <Typography 
                      component="div" 
                      sx={{ 
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '1rem',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {coverLetterContent}
                    </Typography>
                  )}
                </CoverLetterPreview>
              </>
            ) : (
              <Box 
                sx={{ 
                  p: 3, 
                  border: '1px dashed #ccc', 
                  borderRadius: 1, 
                  textAlign: 'center', 
                  bgcolor: '#f9f9f9',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Your cover letter will appear here after generation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter job details and click "Generate Cover Letter"
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Container>
  );
};

export default CoverLetter; 