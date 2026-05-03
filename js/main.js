document.getElementById("run-btn").addEventListener("click", () => {
  const input = getInputs();
  if (!input) return;
  const { processes, quantum } = input;
  const rrResults = runRoundRobin(processes, quantum);
  const psResults = runPriorityScheduler(processes);
  const npResults = runNonPreemptivePriority(processes);
  displayResults(rrResults, psResults, npResults);
  resizeCanvas("rr-canvas");
  resizeCanvas("ps-canvas");
  resizeCanvas("np-canvas");
  drawGantt("rr-canvas", rrResults.timeline);
  drawGantt("ps-canvas", psResults.timeline);
  drawGantt("np-canvas", npResults.timeline);
  displayComparison(rrResults, psResults, npResults);
});
window.addEventListener("resize", () => {
  if (document.getElementById("gantt-section").style.display !== "none") {
    resizeCanvas("rr-canvas");
    resizeCanvas("ps-canvas");
    resizeCanvas("np-canvas");
  }
});
