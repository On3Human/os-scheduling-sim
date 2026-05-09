document.getElementById("run-btn").addEventListener("click", async function() {
  const btn = this;
  const input = getInputs();
  if (!input) return;

  const originalText = btn.innerText;
  btn.innerText = "Running...";
  btn.disabled = true;

  await new Promise(resolve => setTimeout(resolve, 300));

  const { processes, quantum } = input;
  
  const rrResults = runRoundRobin(processes, quantum);
  const npResults = runNonPreemptivePriority(processes);
  const pResults = runPriorityScheduler(processes);
  
  displayResults(rrResults, npResults, pResults);
  
  resizeCanvas("rr-canvas");
  resizeCanvas("np-canvas");
  resizeCanvas("p-canvas");
  
  drawGantt("rr-canvas", rrResults.timeline);
  drawGantt("np-canvas", npResults.timeline);
  drawGantt("p-canvas", pResults.timeline);
  
  displayComparison(rrResults, npResults, pResults);

  btn.innerText = originalText;
  btn.disabled = false;
  
  document.getElementById("results-area").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("resize", () => {
  if (document.getElementById("results-area").style.display !== "none") {
    resizeCanvas("rr-canvas");
    resizeCanvas("np-canvas");
    resizeCanvas("p-canvas");
  }
});

