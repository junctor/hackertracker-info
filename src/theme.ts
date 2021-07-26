// eslint-disable-next-line import/prefer-default-export
export class Theme {
  hexColors = ["#eec643", "#e25238", "#dc8530", "#4999e5", "#64d576"];

  colors = ["blue", "red", "yellow", "green", "orange"];

  index = 0;

  constructor() {
    this.colors.sort(() => Math.random() - 0.5);
  }

  get color(): string {
    if (this.index >= this.colors.length) {
      this.index = 0;
    }

    const color = this.colors[this.index];
    this.index += 1;

    return color;
  }
}
