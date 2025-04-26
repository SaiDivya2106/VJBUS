import React, { useState } from 'react';
import './FileUpload1.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'

  
function FileUpload() {

  let backendURL = process.env.REACT_APP_backend_url;

  const navigate=useNavigate();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [requirements, setRequirements] = useState('');
  const [staffName, setStaffName] = useState('');
  const [domain, setDomain] = useState('');
  const [department, setDepartment] = useState('');
  const user=useSelector((state)=>state.User.currentUser)
  const projectDomains = [
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Cloud Computing', label: 'Cloud Computing' },
    { value: 'Blockchain', label: 'Blockchain' },
    { value: 'IoT (Internet of Things)', label: 'IoT (Internet of Things)' },
    { value: 'Robotics', label: 'Robotics' },
    { value: 'Embedded Systems', label: 'Embedded Systems' },
    { value: 'VLSI', label: 'VLSI' },
    { value: 'Renewable Energy', label: 'Renewable Energy' },
    { value: 'Big Data', label: 'Big Data' },
    { value: 'Quantum Computing', label: 'Quantum Computing' },
    { value: 'Natural Language Processing', label: 'Natural Language Processing' },
    { value: 'Computer Vision', label: 'Computer Vision' },
    { value: 'Augmented Reality (AR)', label: 'Augmented Reality (AR)' },
    { value: 'Virtual Reality (VR)', label: 'Virtual Reality (VR)' },
    { value: 'Wireless Networks', label: 'Wireless Networks' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Biotechnology', label: 'Biotechnology' },
  ];
  
  
    const [selectedDomain, setSelectedDomain] = useState(null);
  
    const handleChange = (selectedOption) => {
      console.log(selectedOption.value)
      setSelectedDomain(selectedOption);
      setDomain(selectedOption.value)
    
    };
    const customStyles = {
      container: (provided) => ({
        ...provided,
        width: '100%',
      }),
      control: (provided) => ({
        ...provided,
        padding: '5px',
        borderRadius: '5px',
        border: 'none',
        boxShadow: 'none',
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '5px',
        marginTop: '0',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#e0e0e0' : 'white', // Change background on hover
        color: 'black',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: 'black', // Text color for selected option
      }),
    };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      abstract,
      requirements,
      staffname:user.name,
      domain,
      department:user.department,
      roll_id:user.id
    };

    try {
      console.log(data,"check this......")
      const token = sessionStorage.getItem('Token');
      const response = await axios.post(`${backendURL}/add_project`,data, {
      
        headers: {
          'Content-Type': 'application/json',
  
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
        body: JSON.stringify(data),
      });
      console.log(response.data)
      if (response.data.message=="Project added successfully!")
      {
        navigate("/EditDeletePublish")
      }

      if (response.ok) {
        // handle successful submission
        //alert('Project submitted successfully!');
        // Clear the form fields
        setTitle('');
        setAbstract('');
        setRequirements('');
        setStaffName('');
        setDomain('');
        setDepartment('');
      } else {
        // handle errors
        //alert('Failed to submit the project. Please try again.');
      }
    } catch (error) {
      // console.error('Error:', error);
      // alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="upload-container" >
      <div className="overlay1">
        <h1>Submit Your Data</h1>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group1">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className='text-black'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="abstract">Abstract</label>
            <textarea
              id="abstract"
               className='text-black'
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              value={requirements}
               className='text-black'
              onChange={(e) => setRequirements(e.target.value)}
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="staffName">Faculty</label>
            <input
              type="text"
              id="staffName"
               className='text-black'
              value={user.name}
             
              required
            />
          </div>
          <div className="form-group1">
            <label htmlFor="domain">Domain</label>
            <Select
        id="domainSelect"
        options={projectDomains}
        styles={customStyles}
        value={selectedDomain}
        onChange={handleChange}
        isSearchable
        placeholder="Search and select a domain..."
      />
          </div>
          <div className="form-group1">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={user.department}
               className='text-black'
              required
            >
              <option value="">Select Department</option>
              <option value="CE">CE</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CSE">CSE</option>
              <option value="CS-AIML">CS-AIML</option>
              <option value="CS-DS">CS-DS</option>
              <option value="CS-IOT">CS-IOT</option>
              <option value="CS-CyS">CS-CyS</option>
              <option value="AI & DS">AI & DS</option>
              <option value="CSBS">CSBS</option>
              <option value="EIE">EIE</option>
              <option value="IT">IT</option>
              <option value="AE">AE</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary nav-link">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default FileUpload;