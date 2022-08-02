class JsonLoader {
  #fileUrl;
  constructor(fileUrl) {
    this.#fileUrl = fileUrl;
  }
  async loadData() {
    return await fetch(this.#fileUrl).then(res => {
      if (!res.ok)
        throw new HttpException(res.statusText, res.status);
      return res.json();
    });
  }
}

async function loadJson(selector, fileUrl) {
  let content = document.querySelector(selector);
  let jsonLoader = new JsonLoader(fileUrl);

  PageEditor.removeChildren(content);

  try {
    let jsonData = await jsonLoader.loadData();

    if (jsonData == null || jsonData.projects == undefined || !jsonData.projects.length)
      return content.insertAdjacentHTML("afterbegin", "<p>Bad JSON data file</p>");

    let table = PageEditor.createTable(content);
    table.insertAdjacentHTML(
      "beforeend",
      `<tr>
        <th>Name</th>
        <th>Title</th>
        <th>Type</th>
        <th>Description</th>
      </tr>`
    );
    for (const project of jsonData.projects) {
      table.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${project.name}</td>
          <td>${project.title}</td>
          <td>${project.type}</td>
          <td>${project.description}</td>
        </tr>`
      );
    }
  } catch (e) {
    content.insertAdjacentHTML("afterbegin",
      `<p>Error "${e.message}"on load JSON data with code ${e.statusCode}</p>`);
  }
}

loadJson("#loadJsonContent", "https://raw.githubusercontent.com/charles66820/portfolio/master/src/data_fr.json");
