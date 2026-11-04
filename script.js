const fields = [
  "name", "role", "email", "phone", "location", "website",
  "summary", "jobTitle", "company", "jobDates", "jobLocation",
  "jobDetails", "degree", "school", "eduDates", "skills",
  "languages", "projects"
];

let currentTemplate = 1;

const $ = id => document.getElementById(id);

function escapeHTML(value) {
  return String(value || "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function val(id) {
  return $(id).value.trim();
}

function lines(text) {
  return text.split("\n").map(x => x.trim()).filter(Boolean);
}

function section(title, content) {
  return content
    ? `<section><h3>${title}</h3>${content}</section>`
    : "";
}

function bullets(text) {
  const items = lines(text);

  return items.length
    ? `<ul>${items.map(x => `<li>${escapeHTML(x)}</li>`).join("")}</ul>`
    : "";
}

function buildResume() {
  const name = escapeHTML(val("name") || "Your Name");
  const role = escapeHTML(val("role"));

  const contact = [
    val("email"),
    val("phone"),
    val("location"),
    val("website")
  ].filter(Boolean).map(escapeHTML).join(" • ");

  const summary = val("summary")
    ? `<p>${escapeHTML(val("summary"))}</p>`
    : "";

  const job = (val("jobTitle") || val("company"))
    ? `
      <div class="item">
        <div class="item-top">
          <span>
            ${escapeHTML(val("jobTitle"))}
            ${val("company") ? " — " + escapeHTML(val("company")) : ""}
          </span>
          <span>${escapeHTML(val("jobDates"))}</span>
        </div>
        <div class="sub">${escapeHTML(val("jobLocation"))}</div>
        ${bullets(val("jobDetails"))}
      </div>
    `
    : "";

  const education = (val("degree") || val("school"))
    ? `
      <div class="item">
        <div class="item-top">
          <span>${escapeHTML(val("degree"))}</span>
          <span>${escapeHTML(val("eduDates"))}</span>
        </div>
        <div class="sub">${escapeHTML(val("school"))}</div>
      </div>
    `
    : "";

  const skills = val("skills")
    ? `<p>${val("skills").split(",").map(escapeHTML).join(" · ")}</p>`
    : "";

  const languages = val("languages")
    ? `<p>${escapeHTML(val("languages"))}</p>`
    : "";

  const projects = bullets(val("projects"));

  let content = "";

  if (currentTemplate === 3) {
    content = `
      <aside class="side">
        <h3>Contact</h3>
        <p>
          ${[
            val("email"),
            val("phone"),
            val("location"),
            val("website")
          ].filter(Boolean).map(escapeHTML).join("<br>")}
        </p>

        ${section("Skills", skills)}
        ${section("Languages", languages)}
      </aside>

      <div class="maincol">
        <h1>${name}</h1>
        <div class="headline">${role}</div>

        ${section("Profile", summary)}
        ${section("Experience", job)}
        ${section("Education", education)}
        ${section("Projects & Certifications", projects)}
      </div>
    `;
  } else {
    content = `
      <h1>${name}</h1>
      <div class="headline">${role}</div>

      <div class="contact">${contact}</div>

      ${section("Professional Summary", summary)}
      ${section("Work Experience", job)}
      ${section("Education", education)}
      ${section("Skills", skills)}
      ${section("Languages", languages)}
      ${section("Projects & Certifications", projects)}
    `;
  }

  $("resumePreview").innerHTML = content;
  $("previewWrap").className = "preview-wrap template-" + currentTemplate;
}

function saveData() {
  const data = {};

  fields.forEach(id => {
    data[id] = $(id).value;
  });

  localStorage.setItem("myresume-ai-data", JSON.stringify(data));
  localStorage.setItem("myresume-ai-template", currentTemplate);
}

function loadData() {
  const data = JSON.parse(
    localStorage.getItem("myresume-ai-data") || "{}"
  );

  fields.forEach(id => {
    $(id).value = data[id] || "";
  });

  currentTemplate = Number(
    localStorage.getItem("myresume-ai-template") || 1
  );
}

function setTemplate(number) {
  currentTemplate = number;

  document.querySelectorAll("[data-template]").forEach(button => {
    button.classList.toggle(
      "active",
      Number(button.dataset.template) === number
    );
  });

  buildResume();
  saveData();
}

fields.forEach(id => {
  $(id).addEventListener("input", () => {
    buildResume();
    saveData();
  });
});

document.querySelectorAll("[data-template]").forEach(button => {
  button.addEventListener("click", () => {
    setTemplate(Number(button.dataset.template));
  });
});

$("downloadBtn").addEventListener("click", () => {
  window.print();
});

$("clearBtn").addEventListener("click", () => {
  fields.forEach(id => $(id).value = "");
  buildResume();
  saveData();
});

$("resetBtn").addEventListener("click", () => {
  if (confirm("Clear all resume information?")) {
    fields.forEach(id => $(id).value = "");
    setTemplate(1);
    buildResume();
    saveData();
  }
});

loadData();
setTemplate(currentTemplate);
