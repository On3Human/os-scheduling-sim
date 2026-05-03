function runNonPreemptivePriority(inputProcesses) {
  let processes = inputProcesses.map(
    (p) => new Process(p.id, p.at, p.bt, p.priority),
  );
  let currentTime = 0;
  let completed = 0;
  let timeline = [];
  let n = processes.length;

  while (completed < n) {
    let available = processes.filter((p) => p.at <= currentTime && p.rem > 0);

    if (available.length > 0) {
      available.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        if (a.at !== b.at) return a.at - b.at;
        return a.id.localeCompare(b.id);
      });

      let p = available[0];

      if (p.firstTime === -1) {
        p.firstTime = currentTime;
        p.rt = p.firstTime - p.at;
      }

      timeline.push({ id: p.id, start: currentTime, end: currentTime + p.bt });

      currentTime += p.bt;
      p.rem = 0;
      p.ct = currentTime;
      p.tat = p.ct - p.at;
      p.wt = p.tat - p.bt;
      completed++;
    } else {
      let idleStart = currentTime;
      let nextArrival = Math.min(
        ...processes.filter((p) => p.rem > 0).map((p) => p.at),
      );
      currentTime = nextArrival;
      timeline.push({ id: "IDLE", start: idleStart, end: currentTime });
    }
  }

  return { processes, timeline };
}
