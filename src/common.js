const delimeter = ',';
export const csvToJson = (csv) => {
        const lines = csv.split('\r\n');
      
        const result = [];
      
        const headers = lines.shift().split(delimeter);
        for (const line of lines) {
          const obj = {};
          const row = line.split(delimeter);
      
          for (let i = 0; i < headers.length; i++) {
            const header = headers[i].trim();
            console.log('header', header);
            obj[header] = row[i]?.trim();
          }
          console.log('obj', obj);
          result.push(obj);
        }
        return result;
      }
export const getHeaders = (csv) => {
        const lines = csv.split('\r\n');
        return lines.shift().split(delimeter);   
}