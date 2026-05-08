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
  
  displayResults(rrResults, npResults);
  
  resizeCanvas("rr-canvas");
  resizeCanvas("np-canvas");
  
  drawGantt("rr-canvas", rrResults.timeline);
  drawGantt("np-canvas", npResults.timeline);
  
  displayComparison(rrResults, npResults);

  btn.innerText = originalText;
  btn.disabled = false;
  
  document.getElementById("results-area").scrollIntoView({ behavior: "smooth" });
});

window.addEventListener("resize", () => {
  if (document.getElementById("results-area").style.display !== "none") {
    resizeCanvas("rr-canvas");
    resizeCanvas("np-canvas");
  }
});

