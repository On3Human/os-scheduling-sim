function drawGantt(canvasId, timeline) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (timeline.length === 0) return;
  const totalDuration = timeline[timeline.length - 1].end;
  const padding = 20;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = 60;
  const yOffset = 40;
  const unitWidth = chartWidth / totalDuration;
  timeline.forEach((segment, index) => {
    const x = padding + segment.start * unitWidth;
    const w = (segment.end - segment.start) * unitWidth;
    if (segment.id === "IDLE") {
      ctx.fillStyle = "#ccc";
    } else {
      ctx.fillStyle = getProcessColor(segment.id);
    }
    ctx.fillRect(x, yOffset, w, chartHeight);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, yOffset, w, chartHeight);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    if (w > 20) {
      ctx.fillText(segment.id, x + w / 2, yOffset + chartHeight / 2 + 5);
    }
    ctx.font = "10px Arial";
    ctx.textAlign = "left";
    ctx.fillText(segment.start, x, yOffset + chartHeight + 15);
    if (index === timeline.length - 1) {
      ctx.textAlign = "right";
      ctx.fillText(segment.end, x + w, yOffset + chartHeight + 15);
    }
  });
}
const colors = {};
function getProcessColor(id) {
  if (!colors[id]) {
    const hue = Math.floor(Math.random() * 360);
    colors[id] = `hsl(${hue}, 70%, 80%)`;
  }
  return colors[id];
}
function resizeCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
}
