// import React from "react";
// import { VictoryPie, VictoryLabel } from "victory";

// const PercentageChart = ({ percentage }) => {
//   const data = getData(percentage);
//   const isFull = percentage === 100;

//   return (
//     <div>
//       <svg viewBox="0 0 200 200" width="100%" height="100%">
//         <VictoryPie
//           standalone={false}
//           width={200}
//           height={200}
//           data={data}
//           innerRadius={60}
//           cornerRadius={isFull ? 0 : 20} // Avoid issues when 100%
//           labels={() => null}
//           style={{
//             data: {
//               fill: ({ datum }) => (datum.x === 1 ? "green" : "transparent"),
//             },
//           }}
//           animate={{
//             duration: 5000,
//             onExit: { duration: 2000 },
//             onEnter: {
//               duration: 5000,
//               before: () => ({ opacity: 0, scale: 0 }),
//               after: () => ({ opacity: 1, scale: 1 }),
//             },
//           }}
//         />
//         <VictoryLabel
//           textAnchor="middle"
//           verticalAnchor="middle"
//           x={100}
//           y={100}
//           text={`${Math.round(percentage)}%`}
//           style={{ fontSize: 20 }}
//         />
//       </svg>
//     </div>
//   );
// };

// const getData = (percentage) => {
//   if (percentage === 100) {
//     return [{ x: 1, y: 100 }];
//   }
//   return [
//     { x: 1, y: percentage },
//     { x: 2, y: 100 - percentage },
//   ];
// };

// export default PercentageChart;
import React from "react";

const PercentageText = ({ percentage }) => {
  return (
    <div className="percentage-text-container">
      <p className="percentage-text">
        {Math.round(percentage)}%
      </p>
    </div>
  );
};

export default PercentageText;

// // import React from 'react';
// // import { VictoryPie, VictoryLabel } from 'victory';

// // const PercentageChart = ({ percentage }) => {
// //   const data = getData(percentage);

// //   return (
// //     <div>
// //     <svg viewBox="0 0 200 200" width="100%" height="100%">
// //       <VictoryPie
// //         standalone={false}
// //         width={200}
// //         height={200}
// //         data={data}
// //         innerRadius={60} // Adjusted to fit smaller size
// //         cornerRadius={20} // Adjusted to fit smaller size
// //         labels={() => null} // No labels on the pie chart slices
// //         style={{
// //           data: {
// //             fill: ({ datum }) => {
// //               const color = datum.y > 30 ? 'green' : 'brown';
// //               return datum.x === 1 ? color : 'transparent';
// //             },
// //           },
// //         }}
// //         animate={{
// //           duration: 5000, // Duration of the animation in milliseconds
// //           onExit: {
// //             duration: 2000,
// //           },
// //           onEnter: {
// //             duration: 5000,
// //             before: () => ({ opacity: 0, scale: 0 }), // Initial state
// //             after: (datum) => ({ opacity: 1, scale: 1 }), // Final state
// //           },
// //         }}
// //       />
// //       <VictoryLabel
// //         textAnchor="middle"
// //         verticalAnchor="middle"
// //         x={100} // Center of the SVG
// //         y={100} // Center of the SVG
// //         text={`${Math.round(percentage)}%`}
// //         style={{ fontSize: 20 }} // Adjusted font size for smaller chart
// //       />
// //     </svg>
// //   </div>

// //   );
// // };

// // const getData = (percentage) => [
// //   { x: 1, y: percentage }, // The percentage slice
// //   { x: 2, y: 100 - percentage }, // The remaining part
// // ];

// // export default PercentageChart;
