function drawGantt(canvasId, timeline) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (timeline.length === 0) return;

  const totalDuration = timeline[timeline.length - 1].end;
  const paddingLeft = 30;
  const paddingRight = 30;
  const chartWidth = canvas.width - (paddingLeft + paddingRight);
  const chartHeight = 50;
  const yOffset = 30;
  const unitWidth = chartWidth / totalDuration;

  timeline.forEach((segment) => {
    const x = paddingLeft + segment.start * unitWidth;
    const w = (segment.end - segment.start) * unitWidth;
    
    if (segment.id === "IDLE" || segment.id === "Idle") {
      ctx.fillStyle = "#f0f0f0";
      ctx.strokeStyle = "#999";
    } else {
      ctx.fillStyle = getProcessColor(segment.id);
      ctx.strokeStyle = "#333";
    }
    
    ctx.fillRect(x, yOffset, w, chartHeight);
    ctx.strokeRect(x, yOffset, w, chartHeight);

    if (w > 25) {
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = (segment.id === "IDLE" || segment.id === "Idle") ? "Idle" : segment.id;
      ctx.fillText(label, x + w / 2, yOffset + chartHeight / 2);
    }
  });

  ctx.fillStyle = "#333";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  ctx.fillText(timeline[0].start, paddingLeft + timeline[0].start * unitWidth, yOffset + chartHeight + 5);

  timeline.forEach((segment) => {
    const xEnd = paddingLeft + segment.end * unitWidth;
    ctx.fillText(segment.end, xEnd, yOffset + chartHeight + 5);
  });
}

const colors = {};
const palette = [
  "hsl(210, 70%, 80%)", // Blue
  "hsl(120, 70%, 80%)", // Green
  "hsl(0, 70%, 80%)",   // Red
  "hsl(280, 70%, 80%)", // Purple
  "hsl(40, 70%, 80%)",  // Orange
  "hsl(180, 70%, 80%)", // Teal
  "hsl(330, 70%, 80%)", // Pink
  "hsl(60, 70%, 80%)",  // Yellow
  "hsl(150, 70%, 80%)", // Seafoam
  "hsl(30, 70%, 80%)"   // Brown
];
let colorIdx = 0;

function getProcessColor(id) {
  if (!colors[id]) {
    colors[id] = palette[colorIdx % palette.length];
    colorIdx++;
  }
  return colors[id];
}

function resizeCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = 120;
}

