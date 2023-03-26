import React, { useState } from "react";
import { csvToJson, getHeaders } from "./common";
import moment from 'moment';
import './App.css';
 
 function App() {
   const [file, setFile] = useState();
   const [json, setJson] = useState([]);
   const [headers, setHeaders] = useState([]);
 
   const fileReader = new FileReader();
   
   const handleOnChange = (e) => {
     setFile(e.target.files[0]);
   };

   moment.defaultFormat = "YYYY-MM-DD";
   const csvFileToArray = string => {
    setHeaders(getHeaders(string));
    setJson(csvToJson(string))
  }
  console.log('json', json);
  if(json) {
  json.forEach(j => {
    console.log('j', j.DateFrom);
   j.DateFrom = moment(j.DateFrom, 'YYYY-MM-DD').toDate()
   j.DateTo = moment(j.DateTo, 'YYYY-MM-DD').toDate()
  })
  };
  console.log('json2', json);
 
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
 
       <table>
         <thead>
           <tr key={"header"}>
             {headers && headers.map((key) => (
               <th>{key}</th>
             ))}
           </tr>
         </thead>
 
          <tbody>
           {json.map((item) => (
             <tr key={item.id}>
               {Object.values(item).map((val) => (
                 <td>{val.toString()}</td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
 }
 export default App;