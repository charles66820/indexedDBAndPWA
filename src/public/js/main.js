function $(s) {
  return document.querySelector(s);
}

// load notes
function showNote() {
  // fetch Like jQuery.ajax()
  fetch("/api/notes", {
    method: "GET"
  }).then(res => res.json())
    .then(res => {
      if ($("#notes").firstChild) $("#notes").firstChild.parentElement.removeChild($("#notes").firstChild);
      if (!res.length) return $("#notes").insertAdjacentHTML("afterbegin", "<p>Error on load notes</p>");
      $("#notes").insertAdjacentHTML("afterbegin", "<table></table>");
      res.forEach(i =>
        $("#notes").firstChild.insertAdjacentHTML(
          "afterbegin",
          `<tr>
            <td>${i.title}</td>
            <td>${i.description}</td>
            <td><button data-id="${i.id}" onclick="deleteNote(this)">Delete</button></td>
          </tr>`
        )
      );
    }).catch(e => {
      console.error("Error on load notes: " + e);
      if ($("#notes").firstChild) $("#notes").firstChild.parentElement.removeChild($("#notes").firstChild);
      $("#notes").insertAdjacentHTML("afterbegin", "<p>Error on load notes</p>");
    });
}

// Delete note
function deleteNote(e) {
  let id = e.dataset["id"];
  fetch("/api/notes/" + id, {
    method: "DELETE"
  }).then(() => {
    e.parentElement.parentElement.parentElement.removeChild(e.parentElement.parentElement);
  }).catch(e => {
    console.error("Error on delete note: " + e);
  });
}

// Add note
$('form[name="addNote"]').addEventListener("submit", function (e) {
  let title = this["title"].value;
  let description = this["description"].value;
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      description: description
    })
  }).then(res => res.json())
    .then(() => showNote())
    .catch(e => console.error("Error on create note: " + e));
  e.preventDefault();
});

$("#sync").addEventListener("click", () => {
  showNote();
});

showNote();