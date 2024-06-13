import Papa from "papaparse";
import { toast } from "react-toastify";

export async function CsvToJsonConvertion(
  data,
  fn,
  header = true,
  skipEmptyLines = true
) {
  Papa.parse(data, {
    header: header,
    skipEmptyLines: skipEmptyLines,
    complete: function (results) {
      const newData = [];
      if (Object.values(results?.data[0])?.length < 6) {
        return toast.error("Csv must contains 6 columns");
      } else {
        results?.data?.forEach((item) => {
          const valuesArray = Object.values(item);
          newData.push({
            column1: valuesArray[0],
            column2: valuesArray[1],
            column3: valuesArray[2],
            column4: valuesArray[3],
            column5: valuesArray[4],
            column6: valuesArray[5],
          });
        });
        fn(newData);
      }
      // results?.data?.map(item => {
      //     newData.push({
      //         column1: item?.Index,
      //         column2: item?.Girth,
      //         column3: item?.Height,
      //         column4: item?.Volume,
      //         column5: item?.Height,
      //         column6: item?.Volume,
      //     })
      // })
    },
  });
}

export async function BulkUserCsvToJsonConvertion(
  data,
  fn,
  header = true,
  skipEmptyLines = true
) {
  Papa.parse(data, {
    header: header,
    skipEmptyLines: skipEmptyLines,
    complete: function (results) {
      const newData = [];
      if (Object.values(results?.data[0])?.length < 8) {
        return toast.error("Csv must contains 8 columns");
      } else {
        results?.data?.forEach((item) => {
          //   const data = toLowerKeys(item);
          newData.push({
            ...item,
          });
        });
        fn(newData);
      }
    },
  });
}

// function toLowerKeys(obj) {
//   return Object.keys(obj).reduce((accumulator, key) => {
//     accumulator[key.toLowerCase()] = obj[key];
//     return accumulator;
//   }, {});
// }
