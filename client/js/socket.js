const ws = new WebSocket('ws://localhost:8999');

const $graph = document.getElementById('graph');
const { width, height } = $graph.getBoundingClientRect();

const MAX = 10;
const MIN = 0;
const GRAPH_PERIOD = 5000;

ws.onerror = function (error) {
  console.warn(`[error] ${error.message}`);
};

ws.onmessage = function (event) {
  if (event.data) {
    const $new = document.createElement('div');
    const { d, t } = JSON.parse(event.data);
    $new.dataset.d = d;
    $new.dataset.t = t;
    $new.className = 'point';
    $new.style.visibility = 'hidden';
    $graph.append($new);
  }
};

let start;
let leadingEdge = Date.now();
let timeSinceLastTick = 0;

function render() {
  const elements = [...$graph.children];
  if (elements.length) {
    elements.forEach(($el) => {
      $el.style.transform = `translate(${
        ((leadingEdge - $el.dataset.t) / GRAPH_PERIOD) * width
      }px, ${($el.dataset.d / MAX) * height}px)`;

      if ($el.dataset.t < leadingEdge - GRAPH_PERIOD) {
        $el.remove();
      }

      $el.style.visibility = 'inherit';
    });
  }
}

function step(timestamp) {
  if (!start) {
    start = timestamp;
  }

  timeSinceLastTick = timestamp - start;

  if (timeSinceLastTick > 30) {
    render();
    leadingEdge = Date.now();
    timeSinceLastTick = 0;
    start = timestamp;
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);

ws.onclose = function () {
  console.info('[close] Connection closed to WS');
};
