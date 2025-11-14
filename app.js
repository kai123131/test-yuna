const COMMANDS = []; // empty for now

const app = {
  q: document.getElementById("q"),
  list: document.getElementById("list"),
  cats: document.getElementById("cats"),
  count: document.getElementById("count"),
  tooltip: document.getElementById("tooltip"),
  sort: document.getElementById("sort"),
  themeBtn: document.getElementById("themeBtn"),
};

function getCategories(){
  const set = new Set();
  COMMANDS.forEach(c => c.tags.forEach(t => set.add(t)));
  return ["all", ...[...set].sort()];
}

function renderCategories(){
  const cats = getCategories();
  app.cats.innerHTML = "";

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat === "all" ? "All Commands" : cat;
    btn.dataset.cat = cat;
    if(cat === "all") btn.classList.add("active");
    btn.onclick = () => {
      document.querySelectorAll(".cat button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderList();
    };
    app.cats.appendChild(btn);
  });
}

function match(cmd, q, cat){
  q = q.toLowerCase();
  if(cat !== "all" && !cmd.tags.includes(cat)) return false;
  return (
    cmd.name.toLowerCase().includes(q) ||
    cmd.desc.toLowerCase().includes(q) ||
    cmd.usage.toLowerCase().includes(q)
  );
}

function renderList(){
  const q = app.q.value;
  const cat = document.querySelector(".cat button.active")?.dataset.cat || "all";
  let items = COMMANDS.filter(c => match(c, q, cat));

  if(app.sort.value === "alpha") items.sort((a,b)=>a.name.localeCompare(b.name));
  else items.sort((a,b)=>b.pop - a.pop);

  app.count.textContent = `Showing ${items.length} commands`;
  app.list.innerHTML = "";

  items.forEach(cmd => {
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `
      <div class="cmd">${cmd.name}</div>
      <div class="meta">
        <h4>${cmd.usage}</h4>
        <p>${cmd.desc}</p>
        <div class="tags">${cmd.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `;
    app.list.appendChild(row);
  });
}

function tooltip(){
  app.tooltip.style.display = "block";
  setTimeout(() => app.tooltip.style.display = "none", 1300);
}

function initTheme(){
  const stored = localStorage.getItem("theme");
  if(stored === "light") document.documentElement.setAttribute("data-theme","light");

  app.themeBtn.onclick = () => {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    if(light){ document.documentElement.removeAttribute("data-theme"); localStorage.setItem("theme","dark"); }
    else { document.documentElement.setAttribute("data-theme","light"); localStorage.setItem("theme","light"); }
  };
}

app.q.oninput = renderList;
app.sort.onchange = renderList;

renderCategories();
initTheme();
renderList();
