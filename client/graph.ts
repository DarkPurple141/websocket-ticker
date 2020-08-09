const MAX = 10;
const MIN = 0;
const GRAPH_PERIOD = 10000;

class Graph {
  leadingEdgeTime: number;
  private $dashboard: HTMLElement;
  private $root: HTMLElement;

  constructor($dashboard: HTMLElement) {
    this.$dashboard = $dashboard;
    this.$root = document.createElement('div');
    this.$root.className = 'graph';
    this.$dashboard.append(this.$root);
    this.leadingEdgeTime = Date.now();
  }

  addDatapoint({ d, t }: { d: number; t: number }) {
    const $new = document.createElement('div');
    $new.dataset.d = d as any;
    $new.dataset.t = t as any;
    $new.className = 'point';
    $new.style.visibility = 'hidden';
    this.$root.append($new);
  }

  render() {
    const elements = [...this.$root.children] as HTMLElement[];
    const { width, height } = this.$root.getBoundingClientRect();
    if (elements.length) {
      elements.forEach(($el) => {
        $el.style.transform = `translate(${
          ((this.leadingEdgeTime - ($el.dataset.t as any)) / GRAPH_PERIOD) *
          width
        }px, ${(($el.dataset.d as any) / MAX) * height}px)`;

        if (($el.dataset.t as any) < this.leadingEdgeTime - GRAPH_PERIOD) {
          $el.remove();
        }

        $el.style.visibility = 'inherit ';
      });
    }
    this.leadingEdgeTime = Date.now();
  }
}

export default Graph;
