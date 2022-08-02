async function loadCsv(selector, fileUrl) {
  let content = document.querySelector(selector);

  PageEditor.removeChildren(content);

  let table = PageEditor.createTable(content);
  let isFirst = true;

  Papa.parse(fileUrl, {
    delimiter: ",",
    newline: "",	// auto-detect
    quoteChar: '"',
    escapeChar: '"',
    download: true,
    dynamicTyping: true,
    header: false,
    step: function (results, parser) {
      if (!results.errors.length) {
        for (const error of results.errors) {
          table.insertAdjacentHTML("beforeend",
            `<tr>
            <th>type: ${error.type}</th>
            <th>code: ${error.code}</th>
            <th>message: ${error.message}</th>
            <th>row: ${error.row}</th>
          </tr>`);
        }

        if (results.data) {
          let row = document.createElement("tr");
          if (isFirst) {
            for (const data of results.data)
              row.insertAdjacentHTML("beforeend", `<th>${data}</th>`);
            isFirst = false;
          } else
            for (const data of results.data)
              row.insertAdjacentHTML("beforeend", `<td>${data}</td>`);

          table.appendChild(row);
        }
      }
    },
    complete: function (results, file) {
      // console.log("Parsing complete:", results, file);
    },
    error: function (e) {
      content.insertAdjacentHTML("afterbegin",
        `<p>Error "${e.message}"to load CSV data with code ${e.code}</p>`);
    }
  });
}

loadCsv("#loadCsvContent", "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm6GUYklQD6XIAxV6mrvubPCkqmQTTDa53AUWCBGqvHFsFhErmWiNSJg_4EEmUuAnbyKwDiW8L_ITt/pub?gid=1914922173&single=true&output=csv");
