export default class Theme {
  colors = new Map([
    ["dc-purple", "#686EA0"],
    ["dc-teal", "#81C8BD"],
    ["dc-yellow", "#ECDA25"],
    ["dc-red", "#F8A28B"],
  ]);

  colorTitles = Array.from(this.colors.keys());

  index = 0;

  randomisze() {
    this.colorTitles.sort(() => Math.random() - 0.5);
  }

  get nextColor(): string {
    if (this.index >= this.colorTitles.length) {
      this.index = 0;
    }

    const color = this.colorTitles[this.index];
    this.index += 1;

    return color;
  }
}
