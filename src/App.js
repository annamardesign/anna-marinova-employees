import React, { useState } from "react";
import { csvToJson, getHeaders, getDays, hasOverlap, calculateOverlap, findAllPairsIndexes } from "./common";
import moment from 'moment';
import './App.css';
 
 function App() {
   const [file, setFile] = useState();
   const [parsedRecords, setParsedRecords] = useState([]);
   const headers = ['ProjectId', 'EmpId 1', 'EmpId 2', 'Days'];
 
   const fileReader = new FileReader();
   
   const handleOnChange = (e) => {
     setFile(e.target.files[0]);
   };

   moment.defaultFormat = "YYYY-MM-DD";
   const csvFileToArray = string => {
    setParsedRecords(csvToJson(string))
  }

  const newTable = [];
  let uniqueProjectIds = [];
  let filteredPairs = [];
  let sortedPairs;

  if(parsedRecords) {
    parsedRecords.forEach(item => {
      item.DateFrom = moment(item.DateFrom, 'YYYY-MM-DD').toDate();
      if(item.DateTo == 'Invalid Date') {
        item.DateTo = new Date();
      }
      item.DateTo = moment(item.DateTo, 'YYYY-MM-DD').toDate();
      item.Days = getDays(item.DateTo, item.DateFrom);
      const itemNoDates = JSON.stringify(item, (key, value) => {
        if (key == "DateFrom" || key == "DateTo") {
          return undefined;
        }
        return value;
      });
      newTable.push(JSON.parse(itemNoDates));
    })

    uniqueProjectIds = [...new Set(parsedRecords.map(item => item.ProjectId))];
    uniqueProjectIds.forEach(projectId => {
      const projectRecords = parsedRecords.filter(r => r.ProjectId === projectId);
      if (projectRecords.length > 1) {
        if (projectRecords.length === 2){
          if (hasOverlap(projectRecords[0], projectRecords[1])) {
            const overlapDuration = calculateOverlap(projectRecords[0], projectRecords[1]);
            filteredPairs.push({EmpID1: projectRecords[0].EmpId, EmpID2: projectRecords[1].EmpId, ProjectId: projectId, Days: overlapDuration})
          }
        }
        if  (projectRecords.length > 2){
          const allPairsIndexes = findAllPairsIndexes(projectRecords.length)
          allPairsIndexes.forEach(pair => {
            if (hasOverlap(projectRecords[pair.index1], projectRecords[pair.index2])){
              const overlapDuration = calculateOverlap(projectRecords[pair.index1], projectRecords[pair.index2]);
              filteredPairs.push({EmpID1: projectRecords[pair.index1].EmpId, EmpID2: projectRecords[pair.index2].EmpId, ProjectId: projectId, Days: overlapDuration})
            }
          })
        }
      }
    })

    sortedPairs = filteredPairs.sort((a,b) => b.Days - a.Days)

    const test = parsedRecords.filter(r => r.ProjectId === '14');
    if(test.length > 0) {
      const overlap = hasOverlap(test[0], test[1]);
      const calculate = calculateOverlap(test[0], test[1]);
    }
  };

  const teamWithHighestDays = sortedPairs && sortedPairs[0];
 
   const handleOnSubmit = (e) => {
     e.preventDefault();
 
     if (file) {
       fileReader.onload = function (event) {
         const text = event.target.result;
         csvFileToArray(text);
       };
 
       fileReader.readAsText(file);
     }
   };

 const getTableRow = () => {
    if(teamWithHighestDays) {
      return (<tr>
        {Object.values(teamWithHighestDays).map((val) => (
          <td>{val.toString()}</td>
        ))}
      </tr>)
    }
    return null;

 };
 
   return (
     <div style={{ textAlign: "center" }}>
       <form>
         <input className="input"
           type={"file"}
           id={"csvFileInput"}
           accept={".csv"}
           onChange={handleOnChange}
         />
 
         <button className="button"
           onClick={(e) => {
             handleOnSubmit(e);
           }}
         >
           Import CSV
         </button>
       </form>
 
       <br />
 
       <table style={{ textAlign: "center" }}>
         <thead>
           <tr key={"header"}>
             {headers && headers.map((header) => (
               <th>{header}</th>
             ))}
           </tr>
         </thead>
 
          <tbody>
             {getTableRow()}
         </tbody>
       </table>
     </div>
   );
 }
 export default App;