// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

window.onload = function() {
  if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark");
  }
  displayConfessions();
  loadArticles();
  displayMoods();
  loadAnalytics();
};

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  localStorage.setItem("user", email);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// AI TAGGING
function getEmotionTag(text){
  text = text.toLowerCase();
  if(text.includes("exam") || text.includes("study")) return "Academic Stress";
  if(text.includes("relationship") || text.includes("breakup")) return "Relationship Distress";
  if(text.includes("tired") || text.includes("burnout")) return "Burnout";
  return "General";
}

// CONFESSION
function postConfession() {
  const text = document.getElementById("confessionInput").value;
  if(text.trim() === "") return;

  const crisisWords = ["suicide","kill","die"];
  let flagged = crisisWords.some(word => text.toLowerCase().includes(word));

  let tag = getEmotionTag(text);

  const confession = { content: text, flagged: flagged, tag: tag };

  let confessions = JSON.parse(localStorage.getItem("confessions")) || [];
  confessions.unshift(confession);
  localStorage.setItem("confessions", JSON.stringify(confessions));

  document.getElementById("confessionInput").value = "";

  if(flagged){
    alert("⚠️ Crisis detected. Please visit Get Help page immediately.");
  }

  displayConfessions();
}

function displayConfessions(){
  const container = document.getElementById("confessionList");
  if(!container) return;

  container.innerHTML = "";
  let confessions = JSON.parse(localStorage.getItem("confessions")) || [];

  confessions.forEach(c=>{
    if(!c.flagged){
      const div = document.createElement("div");
      div.className="card";
      div.innerHTML = `<div class="tag">${c.tag}</div><p>${c.content}</p>`;
      container.appendChild(div);
    }
  });
}

// ADMIN
function loadAdmin(){
  const container = document.getElementById("adminList");
  if(!container) return;

  let confessions = JSON.parse(localStorage.getItem("confessions")) || [];

  confessions.forEach((c,i)=>{
    if(c.flagged){
      const div = document.createElement("div");
      div.className="card";
      div.innerHTML = `
        <p>${c.content}</p>
        <button onclick="approve(${i})">Approve</button>
        <button onclick="deleteConfession(${i})">Delete</button>
      `;
      container.appendChild(div);
    }
  });
}

function approve(i){
  let confessions = JSON.parse(localStorage.getItem("confessions"));
  confessions[i].flagged=false;
  localStorage.setItem("confessions", JSON.stringify(confessions));
  location.reload();
}

function deleteConfession(i){
  let confessions = JSON.parse(localStorage.getItem("confessions"));
  confessions.splice(i,1);
  localStorage.setItem("confessions", JSON.stringify(confessions));
  location.reload();
}

// BLOG
function loadArticles(){
  const container = document.getElementById("articleList");
  if(!container) return;

  articles.forEach(a=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerHTML=`<h3>${a.title}</h3><p>${a.content}</p>`;
    container.appendChild(div);
  });
}

// QUIZ
let totalScore=0;
function startQuiz(){
  const container=document.getElementById("quizContainer");
  if(!container) return;

  quizQuestions.forEach(q=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerHTML=`
      <p>${q.question}</p>
      <button onclick="addScore(${q.weight})">Yes</button>
      <button onclick="addScore(0)">No</button>
    `;
    container.appendChild(div);
  });
}

function addScore(val){
  totalScore+=val;
  document.getElementById("result").innerText=
    totalScore>=5
    ? "High stress detected. Consider support."
    : "You seem stable. Keep tracking your mood.";
}

// MOOD
function saveMood(){
  const mood=document.getElementById("mood").value;
  let moods=JSON.parse(localStorage.getItem("moods"))||[];
  moods.push({mood:mood,date:new Date().toLocaleDateString()});
  localStorage.setItem("moods",JSON.stringify(moods));
  displayMoods();
}

function displayMoods(){
  const container=document.getElementById("moodList");
  if(!container) return;

  container.innerHTML="";
  let moods=JSON.parse(localStorage.getItem("moods"))||[];
  moods.forEach(m=>{
    const div=document.createElement("div");
    div.className="card";
    div.innerText=`${m.date}: ${m.mood}`;
    container.appendChild(div);
  });
}

// ANALYTICS
function loadAnalytics(){
  const container=document.getElementById("analyticsData");
  if(!container) return;

  let confessions=JSON.parse(localStorage.getItem("confessions"))||[];
  let moods=JSON.parse(localStorage.getItem("moods"))||[];

  container.innerHTML=`
    <div class="card">Total Confessions: ${confessions.length}</div>
    <div class="card">Mood Entries: ${moods.length}</div>
    <div class="card">Premium Users (Demo): 12%</div>
  `;
}
