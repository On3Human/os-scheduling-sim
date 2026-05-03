const processBody = document.getElementById("process-body");
const addRowBtn = document.getElementById("add-row");
const errorMsg = document.getElementById("error-msg");
addRowBtn.addEventListener("click", () => {
  const rowCount = processBody.rows.length + 1;
  const newRow = document.createElement("tr");
  newRow.innerHTML = `        <td><input type="text" class="p-id" value="P${rowCount}"></td>        <td><input type="number" class="p-at" min="0" value="0"></td>        <td><input type="number" class="p-bt" min="1" value="5"></td>        <td><input type="number" class="p-priority" value="1"></td>        <td><button class="remove-row">Remove</button></td>    `;
  processBody.appendChild(newRow);
});
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
  const quantum = parseInt(document.getElementById("quantum").value);
  errorMsg.innerText = "";
  if (isNaN(quantum) || quantum <= 0) {
    showError("Time Quantum must be a positive integer.");
    return null;
  }
  for (const row of rows) {
    const id = row.querySelector(".p-id").value.trim();
    const at = row.querySelector(".p-at").value;
    const bt = row.querySelector(".p-bt").value;
    const priority = row.querySelector(".p-priority").value;
    if (id === "") {
      showError("Process ID cannot be empty.");
      return null;
    }
    if (ids.has(id)) {
      showError(`Duplicate Process ID: ${id}`);
      return null;
    }
    ids.add(id);
    if (at === "" || isNaN(at) || parseInt(at) < 0) {
      showError(`Invalid Arrival Time for ${id}. Must be >= 0.`);
      return null;
    }
    if (bt === "" || isNaN(bt) || parseInt(bt) <= 0) {
      showError(`Invalid Burst Time for ${id}. Must be > 0.`);
      return null;
    }
    if (priority === "" || isNaN(priority)) {
      showError(`Invalid Priority for ${id}.`);
      return null;
    }
    processes.push({
      id,
      at: parseInt(at),
      bt: parseInt(bt),
      priority: parseInt(priority),
    });
  }
  return { processes, quantum };
}
function showError(msg) {
  errorMsg.innerText = msg;
}
function displayResults(rrData, psData, npData) {
  fillResultTable("rr-result-table", rrData);
  fillResultTable("ps-result-table", psData);
  fillResultTable("np-result-table", npData);
}
function fillResultTable(tableId, data) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  let totalWT = 0,
    totalTAT = 0,
    totalRT = 0;
  data.processes.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `            <td>${p.id}</td>            <td>${p.wt}</td>            <td>${p.tat}</td>            <td>${p.rt}</td>        `;
    tbody.appendChild(row);
    totalWT += p.wt;
    totalTAT += p.tat;
    totalRT += p.rt;
  });
  const avgRow = document.createElement("tr");
  const n = data.processes.length;
  avgRow.innerHTML = `        <td><strong>Average</strong></td>        <td><strong>${(totalWT / n).toFixed(2)}</strong></td>        <td><strong>${(totalTAT / n).toFixed(2)}</strong></td>        <td><strong>${(totalRT / n).toFixed(2)}</strong></td>    `;
  tbody.appendChild(avgRow);
}
function displayComparison(rr, ps, np) {
  const compText = document.getElementById("comparison-text");
  const concText = document.getElementById("conclusion-text");
  const n = rr.processes.length;
  const rrAvgWT = rr.processes.reduce((a, b) => a + b.wt, 0) / n;
  const psAvgWT = ps.processes.reduce((a, b) => a + b.wt, 0) / n;
  const npAvgWT = np.processes.reduce((a, b) => a + b.wt, 0) / n;
  const rrAvgTAT = rr.processes.reduce((a, b) => a + b.tat, 0) / n;
  const psAvgTAT = ps.processes.reduce((a, b) => a + b.tat, 0) / n;
  const npAvgTAT = np.processes.reduce((a, b) => a + b.tat, 0) / n;
  const rrAvgRT = rr.processes.reduce((a, b) => a + b.rt, 0) / n;
  const psAvgRT = ps.processes.reduce((a, b) => a + b.rt, 0) / n;
  const npAvgRT = np.processes.reduce((a, b) => a + b.rt, 0) / n;
  compText.innerHTML = `        <p><strong>Round Robin:</strong> Avg WT = ${rrAvgWT.toFixed(2)}, Avg TAT = ${rrAvgTAT.toFixed(2)}, Avg RT = ${rrAvgRT.toFixed(2)}</p>        <p><strong>Priority (Preemptive):</strong> Avg WT = ${psAvgWT.toFixed(2)}, Avg TAT = ${psAvgTAT.toFixed(2)}, Avg RT = ${psAvgRT.toFixed(2)}</p>        <p><strong>Priority (Non-Preemptive):</strong> Avg WT = ${npAvgWT.toFixed(2)}, Avg TAT = ${npAvgTAT.toFixed(2)}, Avg RT = ${npAvgRT.toFixed(2)}</p>    `;
  let best = "Round Robin";
  let minWT = rrAvgWT;
  if (psAvgWT < minWT) {
    minWT = psAvgWT;
    best = "Priority (Preemptive)";
  }
  if (npAvgWT < minWT) {
    minWT = npAvgWT;
    best = "Priority (Non-Preemptive)";
  }
  concText.innerText = `Conclusion: ${best} performed best in terms of average waiting time for this input.`;
}
