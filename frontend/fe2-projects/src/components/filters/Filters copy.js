// import React from 'react';
// import './Filter.css';
// import { useLocation } from 'react-router-dom';
// import Projects from '../projects/Projects';

// function Filters() {
//   const location = useLocation();
//   const { state } = useLocation();
//   console.log(location);
//   console.log(state);
//   const projects = state;

//   return (
//     <div>
//       {projects.map((project) => (
//         <div key={project.id} className="project-box shadow-lg">
//           <div className='d-flex ' style={{ flexDirection: 'column' }}>
//             <h3 className='text-start m1'><strong>Title:</strong> {project.ProjectTitle}</h3>
//             <h3 className='text-start m1'><strong>ProjectID:</strong>  {project.ProjectId}</h3>
//             <h3 className='text-start m1'><strong>Year:</strong>  {project.Year}</h3>
//             {project.AdditionalInfo.Domain && (
//               <h3 className='text-start m1'>
//                 <strong>Domain:</strong> {project.AdditionalInfo.Domain}
//               </h3>
//             )}
//             <h3 className='text-start m1'><strong>Type:</strong> {project.Project_Type}</h3>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Filters;
import React from 'react';
import './Filter.css';
import { useLocation } from 'react-router-dom';

function Filters() {
  const { state: projects } = useLocation();

  return (
    <div className="container my-4">
      <div className="row">
        {projects?.map((project, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="project-box shadow-lg p-3 rounded bg-white h-100">
              <div className="d-flex flex-column">
                <h5 className="text-start m-1">
                  <strong>Title:</strong> {project.ProjectTitle || 'N/A'}
                </h5>
                <h5 className="text-start m-1">
                  <strong>Project ID:</strong> {project.ProjectId || 'N/A'}
                </h5>
                <h5 className="text-start m-1">
                  <strong>Year:</strong> {project.Year || 'N/A'}
                </h5>
                {project?.AdditionalInfo?.Domain && (
                  <h5 className="text-start m-1">
                    <strong>Domain:</strong> {project.AdditionalInfo.Domain}
                  </h5>
                )}
                <h5 className="text-start m-1">
                  <strong>Type:</strong> {project.Project_Type || 'N/A'}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filters;
