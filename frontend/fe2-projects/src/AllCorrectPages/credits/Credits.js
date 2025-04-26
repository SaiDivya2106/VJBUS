import React from 'react';
import './Credits.css';
import a from '../images/face';
import b from '../images/face1';

const people = [
  {
    role: 'Project Head',
    name: 'Pavan Kumar',
    Branch: 'IT',
    image: b,
  },
  {
    role: 'Developer,Backend',
    name: 'T.Kiranmayi',
    Branch: 'IT',
    image: a,
  },
  {
    role: 'Developer,Frontend',
    name: 'B.Venkata Harshini',
    Branch: 'ECE',
    image: a,
  },
  {
    role: 'Developer',
    name: 'N.Dwaraka',
    Branch: '', // Empty branch field
    image: a,
  },
];

const teacher = [
  {
    name: 'Krishna Prasad',
    Designation: 'Head of IIE',
    image: b,
  },
  {
    name: 'Y.Padma Sai',
    Designation: 'ECE Professor & Student Dean',
    image: a,
  },
];

const Credits = () => {
  return (
    <div className="Credits">

      <h1 className='credits-text text-center'>PROJECT CONTRIBUTORS</h1>

      {people.map((person, index) => (
        <div
          className={`person-container ${
            index % 2 === 0 ? 'image-left' : 'image-right'
          }`}
          key={index}
        >
          <img src={person.image} alt={person.name} className="person-image" />
          <div className="person-details">
            <h2>{person.role}</h2>
            <h3>{person.name}</h3>
            {person.Branch && <p>{person.Branch}</p>} {/* Only show if Branch is not empty */}
          </div>
        </div>
      ))}

      <h2>Under The Guidance of</h2>
      
      {teacher.map((person, index) => (
        <div
          className={`person-container ${
            index % 2 === 0 ? 'image-left' : 'image-right'
          }`}
          key={index}
        >
          <img src={person.image} alt={person.name} className="person-image" />
          <div className="person-details">
            <h3>{person.name}</h3>
            {person.Designation && <p>{person.Designation}</p>} {/* Only show if Branch is not empty */}
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default Credits;
