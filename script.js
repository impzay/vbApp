//const drillLibDiv = document.getElementById("drillLibrary");
//drillLibDiv.style.backgroundColor = "#54863db9";

class Drill {
    constructor(name, duration, players, focus, description){
        this.name = name;
        this.duration = duration;
        this.players = players;
        this.focus = focus;
        this.desc = description;
    }
}

const drills = [
    new Drill("Pepper", 10, 2, "Warmup", "Two players each pass to each other back and forth."),
    new Drill("Serve Recieve", 15, 6, "Receiving", "4 on recieving side pass to setter and play out point, usual warmup drill."),
    new Drill("Dungeons", 30, 3, "Defense", "Teams of 2 players get 3 touches with control and accuracy back to the hitter, up to 10 times."),
    new Drill("Backrow Attack", 30, 6, "All", "3v3 backrow only, far side stays until they lose, 1 point each"),
    new Drill("6v6", 30, 12, "All", "Regular 6v6, one set to 25, can add punishment if travel practice"),
    new Drill("Hitting Lines", 20, 3, "Hitting", "Hitter passes for themself and then swings after the set, can be done with blocks or without.")
];

const savedPlans = localStorage.getItem("practicePlans");
const practicePlans = {};

if(savedPlans){
    Object.assign(practicePlans, JSON.parse(savedPlans));
}

const datePicker = document.getElementById("practiceDate");
let currentDate = null;

function renderDrill(drill){
    const planItem = document.createElement("li");
    planItem.textContent = `${drill.name}`;
    planList.appendChild(planItem);
    progBar.value = Number(progBar.value) + drill.duration;
}

function addDrillToPlan(drill){
    if(!currentDate){
        alert("Select a date.");
        return;
    }

    if(progBar.value >= progBar.max){
        alert("Practice is full.");
        return;
    }
    practicePlans[currentDate].push(drill);
    
    //renderDrill(drill);

    localStorage.setItem(
        "practicePlans",
        JSON.stringify(practicePlans)
    );
}

function createPracticePlan(date){
    planList.innerHTML = "";
    progBar.value = 0;

    practicePlans[date] = [];
}

function loadPracticePlan(date){
    planList.innerHTML = "";
    progBar.value = 0;

    console.log(practicePlans,"|", currentDate);
    if(!practicePlans[date]) {
        console.log("no practice plans for this date.");
        createPracticePlan(date);
    };

    practicePlans[date].forEach(drill => {
        renderDrill(drill);
        console.log("adding drills...");
    });
}

datePicker.addEventListener("change", () => {
    currentDate = datePicker.value;
    loadPracticePlan(currentDate);
    console.log("loading");
})

const drillList = document.getElementById("drillList");
const planList = document.getElementById("planList");
const progBar = document.getElementById("time");
const planClearBtn = document.getElementById("resetPlan");
const planSaveBtn = document.getElementById("savePlan");

planList.addEventListener("dragover", (event) => {
    event.preventDefault();
})

planList.addEventListener("drop", (event) => {
    event.preventDefault();

    if(progBar.value >= progBar.max){
        alert("Practice is full.");
        return;
    }
    
    
    const index = event.dataTransfer.getData("drillIndex");
    const drill = drills[index];

    const planItem = document.createElement("li");
    planItem.textContent = `${drill.name} - ${drill.duration} min - ${drill.players} players (minimum) - ${drill.focus} - ${drill.desc}`;
    planList.appendChild(planItem);
    progBar.value = progBar.value + drill.duration;

    addDrillToPlan(drill);

})

planClearBtn.addEventListener("click", () => {
    if(currentDate && practicePlans[currentDate]){
        practicePlans[currentDate] = [];
        localStorage.setItem("practicePlans", JSON.stringify(practicePlans));
    }
    
    planList.innerHTML = "";
    progBar.value = 0;
})

planSaveBtn.addEventListener("click", () => {
    if(currentDate && practicePlans[currentDate]){
        localStorage.setItem("practicePlans", JSON.stringify(practicePlans));
    }
    console.log("saved plan!");
})

drills.forEach((drill,index) => {
    if(progBar.value >= progBar.max){
        alert("Practice is full.");
        return;
    }
   const li = document.createElement("li");
   li.textContent = `${drill.name} - ${drill.duration} min`;
   li.draggable = true;

   li.addEventListener("dragstart", (event)=>{
    event.dataTransfer.setData("drillIndex", index);
   })

   li.addEventListener("click", () => {
    console.log("still running nerd");

    const planItem = document.createElement("li");
    planItem.textContent = `${drill.name} - ${drill.duration} min - ${drill.players} players (minimum) - ${drill.focus} - ${drill.desc}`;
    planList.appendChild(planItem);
    //console.log(drill.duration);
    progBar.value = progBar.value + drill.duration;
    addDrillToPlan(drill);

    planItem.addEventListener("click", () => {
        planItem.remove();
        progBar.value = progBar.value - drill.duration;
    });
    });

   drillList.appendChild(li);
});


