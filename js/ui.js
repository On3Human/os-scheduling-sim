const processBody = document.getElementById("process-body");
const addRowBtn = document.getElementById("add-row");
const errorMsg = document.getElementById("error-msg");
const scenarioSelect = document.getElementById("scenario-select");
const scenarioDescription = document.getElementById("scenario-description");
const resultsArea = document.getElementById("results-area");

const SCENARIOS = {
  A: {
    quantum: 3,
    processes: [
      { id: "P1", at: 0, bt: 6, priority: 3 },
      { id: "P2", at: 1, bt: 4, priority: 1 },
      { id: "P3", at: 2, bt: 8, priority: 4 },
      { id: "P4", at: 3, bt: 2, priority: 2 },
      { id: "P5", at: 4, bt: 5, priority: 3 },
    ],
    description:
      "Normal mixed workload that observes general behavior of both algorithms.",
  },
  B: {
    quantum: 4,
    processes: [
      { id: "P1", at: 0, bt: 10, priority: 4 },
      { id: "P2", at: 1, bt: 3, priority: 1 },
      { id: "P3", at: 2, bt: 5, priority: 4 },
      { id: "P4", at: 3, bt: 2, priority: 1 },
      { id: "P5", at: 5, bt: 7, priority: 3 },
    ],
    description:
      "Two high-priority processes to observe how Priority scheduling favors them vs RR.",
  },
  C: {
    quantum: 2,
    processes: [
      { id: "P1", at: 0, bt: 8, priority: 3 },
      { id: "P2", at: 0, bt: 8, priority: 3 },
      { id: "P3", at: 0, bt: 8, priority: 3 },
      { id: "P4", at: 0, bt: 8, priority: 3 },
    ],
    description:
      "Equal processes: RR, distributes service evenly; Priority is FCFS here.",
  },
  D: {
    quantum: 3,
    processes: [
      { id: "P1", at: 0, bt: 2, priority: 1 },
      { id: "P2", at: 0, bt: 3, priority: 1 },
      { id: "P3", at: 0, bt: 4, priority: 1 },
      { id: "P4", at: 0, bt: 5, priority: 1 },
      { id: "P5", at: 0, bt: 10, priority: 5 },
    ],
    description:
      "One low-priority process competes with four high priority ones: starvation risk.",
  },
  E: {
    quantum: 0,
    processes: [
      { id: "P1", at: 0, bt: 5, priority: 1 },
      { id: "P2", at: -1, bt: 3, priority: 2 },
      { id: "P3", at: 2, bt: 0, priority: 1 },
      { id: "P4", at: 3, bt: 4, priority: -1 },
    ],
    description: "Invalid inputs",
  },
};

scenarioSelect.addEventListener("change", (e) => {
  const scenario = SCENARIOS[e.target.value];
  if (scenario) {
    document.getElementById("quantum").value = scenario.quantum;
    scenarioDescription.innerText = scenario.description;
    processBody.innerHTML = "";
    scenario.processes.forEach((p) => {
      addProcessRow(p.id, p.at, p.bt, p.priority);
    });
    document
      .getElementById("input-section")
      .scrollIntoView({ behavior: "smooth" });
  } else {
    scenarioDescription.innerText =
      "Select a scenario to auto-fill the process table.";
  }
});

function addProcessRow(id = "", at = "", bt = "", priority = "") {
  const rowCount = processBody.rows.length + 1;
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td><input type="text" class="p-id" value="${id || "P" + rowCount}"></td>
        <td><input type="number" class="p-at" value="${at}"></td>
        <td><input type="number" class="p-bt" value="${bt}"></td>
        <td><input type="number" class="p-priority" value="${priority}"></td>
        <td><button class="remove-row">Remove</button></td>
    `;
  processBody.appendChild(newRow);
}

addRowBtn.addEventListener("click", () => addProcessRow());

processBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-row")) {
    const row = e.target.closest("tr");
    if (processBody.rows.length > 1) {
      row.remove();
    } else {
      alert("At least one process is required.");
    }
  }
});

function getInputs() {
  const rows = processBody.querySelectorAll("tr");
  const processes = [];
  const ids = new Set();
  const quantumVal = document.getElementById("quantum").value;
  const quantum = parseInt(quantumVal);

  errorMsg.innerText = "";
  let hasError = false;

  if (quantumVal === "" || isNaN(quantum) || quantum < 1) {
    showError("Quantum must be a positive integer.");
    hasError = true;
  }

  if (rows.length === 0) {
    showError("Minimum 1 process required.");
    hasError = true;
  } else if (rows.length > 10) {
    showError("Maximum 10 processes allowed.");
    hasError = true;
  }

  for (const row of rows) {
    const id = row.querySelector(".p-id").value.trim();
    const atVal = row.querySelector(".p-at").value;
    const btVal = row.querySelector(".p-bt").value;
    const priorityVal = row.querySelector(".p-priority").value;

    const at = parseInt(atVal);
    const bt = parseInt(btVal);
    const priority = parseInt(priorityVal);

    if (id === "") {
      showError("Process ID cannot be empty.");
      hasError = true;
    } else if (ids.has(id)) {
      showError(`Duplicate Process ID: ${id}`);
      hasError = true;
    }
    ids.add(id);

    if (atVal === "" || isNaN(at) || at < 0) {
      showError(`Invalid Arrival Time for ${id}. Must be >= 0.`);
      hasError = true;
    }
    if (btVal === "" || isNaN(bt) || bt < 1) {
      showError(`Invalid Burst Time for ${id}. Must be >= 1.`);
      hasError = true;
    }
    if (priorityVal === "" || isNaN(priority) || priority < 1) {
      showError(`Invalid Priority for ${id}. Must be >= 1.`);
      hasError = true;
    }

    if (!hasError) {
      processes.push({ id, at, bt, priority });
    }
  }

  return hasError ? null : { processes, quantum };
}

function showError(msg) {
  const p = document.createElement("p");
  p.innerText = msg;
  errorMsg.appendChild(p);
}

function displayResults(rrData, npData) {
  resultsArea.style.display = "block";
  fillResultTable("rr-result-table", rrData);
  fillResultTable("np-result-table", npData);
}

function fillResultTable(tableId, data) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  let totalWT = 0,
    totalTAT = 0,
    totalRT = 0;

  const sortedProcesses = [...data.processes].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  let maxWT = -1;
  let minWT = Infinity;

  sortedProcesses.forEach((p) => {
    if (p.wt > maxWT) maxWT = p.wt;
    if (p.wt < minWT) minWT = p.wt;
  });

  sortedProcesses.forEach((p) => {
    const row = document.createElement("tr");
    if (p.wt === maxWT && maxWT !== minWT) row.classList.add("worst-wt");
    if (p.wt === minWT && maxWT !== minWT) row.classList.add("best-wt");

    row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.at}</td>
            <td>${p.bt}</td>
            <td>${p.priority}</td>
            <td>${p.firstTime}</td>
            <td>${p.ct}</td>
            <td>${p.wt}</td>
            <td>${p.tat}</td>
            <td>${p.rt}</td>
        `;
    tbody.appendChild(row);
    totalWT += p.wt;
    totalTAT += p.tat;
    totalRT += p.rt;
  });

  const n = sortedProcesses.length;
  const footer = document.createElement("tr");
  footer.className = "average-row";
  footer.innerHTML = `
        <td colspan="6"><strong>Averages</strong></td>
        <td><strong>${(totalWT / n).toFixed(2)}</strong></td>
        <td><strong>${(totalTAT / n).toFixed(2)}</strong></td>
        <td><strong>${(totalRT / n).toFixed(2)}</strong></td>
    `;
  tbody.appendChild(footer);
}

function displayComparison(rr, np) {
  const summaryCard = document.getElementById("comparison-summary");
  const conclusionCard = document.getElementById("final-conclusion");
  const n = rr.processes.length;

  const rrAvgWT = rr.processes.reduce((a, b) => a + b.wt, 0) / n;
  const npAvgWT = np.processes.reduce((a, b) => a + b.wt, 0) / n;
  const rrAvgRT = rr.processes.reduce((a, b) => a + b.rt, 0) / n;
  const npAvgRT = np.processes.reduce((a, b) => a + b.rt, 0) / n;

  const calcSD = (procs) => {
    const avgTAT = procs.reduce((a, b) => a + b.tat, 0) / n;
    const squareDiffs = procs.map((p) => Math.pow(p.tat - avgTAT, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(avgSquareDiff);
  };

  const rrSD = calcSD(rr.processes);
  const npSD = calcSD(np.processes);

  const npStarvation = np.processes.some((p) => {
    const others = np.processes.filter((o) => o.id !== p.id);
    const avgOthersWT = others.reduce((a, b) => a + b.wt, 0) / (n - 1);
    return p.wt > 2 * avgOthersWT;
  });

  const highestPriority = [...np.processes].sort(
    (a, b) => a.priority - b.priority,
  )[0];
  const hpRR = rr.processes.find((p) => p.id === highestPriority.id);
  const urgencyAdvantage = highestPriority.rt < hpRR.rt;

  summaryCard.innerHTML = `
    <ul>
      <li>Priority achieved lower average WT (${npAvgWT.toFixed(2)}) vs RR (${rrAvgWT.toFixed(2)}).</li>
      <li>Priority achieved lower average RT (${npAvgRT.toFixed(2)}) vs RR (${rrAvgRT.toFixed(2)}).</li>
      <li>Urgent processes gained significant advantage in Priority scheduling.</li>
      <li>RR appeared more balanced (TAT SD: ${rrSD.toFixed(2)}) vs Priority (${npSD.toFixed(2)}).</li>
      <li>${npStarvation ? "Starvation risk observed in Priority scheduling." : "No significant starvation risk in Priority scheduling."}</li>
    </ul>
  `;

  conclusionCard.innerHTML = `
    <h3>Final Conclusion</h3>
    <p>Overall, <strong>${npAvgWT < rrAvgWT ? "Priority Scheduling" : "Round Robin"}</strong> performed better on this dataset. 
    Priority-based service ${urgencyAdvantage ? "successfully improved" : "did not significantly improve"} urgent-task treatment. 
    Round Robin ${rrSD < npSD ? "provided" : "did not provide"} better fairness in this specific case. 
    Starvation risk was ${npStarvation ? "present" : "minimal"} in the Priority algorithm.</p>
  `;
}
