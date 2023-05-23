import csvtojson from "csvtojson";

const csv =
  'Time,ScanID,Pages\n23-05-2023,"646c66bbd961ec82aca3d382",1\n23-05-2023,"646c9c86ce5d74f17100d17d",1\n23-05-2023,"646ca5bc3e3f71333903f072",1\n23-05-2023,"646ca6503e3f71333903f083",3\n23-05-2023,"646ca79d40f5b7f909283cc0",3\n23-05-2023,"646ca85840f5b7f909283ce7",1\n23-05-2023,"646cab9e77f7ddc787a5c5f3",1\n';

async function convert() {
  const jsonData = await csvtojson({
    noheader: true,
    output: "csv",
  }).fromString(csv);
  console.log({ jsonData });
}

convert();