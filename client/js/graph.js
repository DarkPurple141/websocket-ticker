const MAX = 10;
const MIN = 0;
const GRAPH_PERIOD = 10000;

class Graph {
  constructor($dashboard) {
    this.$dashboard = $dashboard;
    this.$root = document.createElement('div');
    this.$root.className = 'graph';
    this.$dashboard.append(this.$root);
    this.leadingEdgeTime = Date.now();
  }

  addDatapoint({ d, t }) {
    const $new = document.createElement('div');
    $new.dataset.d = d;
    $new.dataset.t = t;
    $new.className = 'point';
    $new.style.visibility = 'hidden';
    this.$root.append($new);
  }

  render() {
    const elements = [...this.$root.children];
    const { width, height } = this.$root.getBoundingClientRect();
    if (elements.length) {
      elements.forEach(($el) => {
        $el.style.transform = `translate(${
          ((this.leadingEdgeTime - $el.dataset.t) / GRAPH_PERIOD) * width
        }px, ${($el.dataset.d / MAX) * height}px)`;

        if ($el.dataset.t < this.leadingEdgeTime - GRAPH_PERIOD) {
          $el.remove();
        }

        $el.style.visibility = 'inherit';
      });
    }
    this.leadingEdgeTime = Date.now();
    // debugger;
  }
}

export default Graph;
