import model from './model.js';
import Graph from './graph.js';

const $dashboard = document.getElementById('dashboard')!;

const graphs = [
  new Graph($dashboard),
  new Graph($dashboard),
  new Graph($dashboard),
  new Graph($dashboard),
];

graphs.forEach((g) => {
  model.addSubscriber(g.addDatapoint.bind(g));
});

let start: number;
let timeSinceLastTick = 0;

function step(timestamp: DOMHighResTimeStamp) {
  if (!start) {
    start = timestamp;
  }

  timeSinceLastTick = timestamp - start;

  if (timeSinceLastTick > 60) {
    graphs.forEach((g) => {
      g.render();
    });
    timeSinceLastTick = 0;
    start = timestamp;
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
