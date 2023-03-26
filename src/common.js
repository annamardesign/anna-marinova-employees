const delimeter = ',';
const getLaterDate = (firstDate, secondDate) => {
        if(firstDate < secondDate) {
                return secondDate
        }
        return firstDate;
};
const getSoonerDate = (firstDate, secondDate) => {
        if(firstDate < secondDate) {
                return firstDate
        }
        return secondDate;
};

export const csvToJson = (csv) => {
        const lines = csv.split('\r\n');
      
        const result = [];
      
        const headers = lines.shift().split(delimeter);
        for (const line of lines) {
          const obj = {};
          const row = line.split(delimeter);
      
          for (let i = 0; i < headers.length; i++) {
            const header = headers[i].trim();
            obj[header] = row[i]?.trim();
          }
          result.push(obj);
        }
        return result;
}
export const getHeaders = (csv) => {
        const lines = csv.split('\r\n');
        return lines.shift().split(delimeter);   
}
export const getDays = (date_1, date_2) =>{
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
};
export const getDaysFromUnix = (timestamp1, timestamp2) => {
        let difference = timestamp1 - timestamp2;
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
};

export const hasOverlap = (firstRecord, secondRecord) => {
        return (firstRecord.DateFrom.getTime() <= secondRecord.DateTo.getTime()
                && (firstRecord.DateTo.getTime() >= secondRecord.DateTo.getTime()))
};

export const calculateOverlap = (firstRecord, secondRecord) => {
        const periodStart = getLaterDate(firstRecord.DateFrom.getTime(), secondRecord.DateFrom.getTime());
        const periodEnd = getSoonerDate(secondRecord.DateTo.getTime(), firstRecord.DateTo.getTime());
        return getDaysFromUnix(periodEnd, periodStart);
};

export const findAllPairsIndexes = (arrLength) => {
        let arrIndexes = [];

        for (let i = 0; i < arrLength; i++){
                arrIndexes.push(i);
        }

        var i, j, result = [];
        for (i = 0; i < arrIndexes.length; i++) {
            for (j = i; j < arrIndexes.length; j++) {
                if (i !== j) {
                        result.push({ index1: arrIndexes[i], index2: arrIndexes[j]})
                }
            }
        }
        return result;
};