export default class Theme {
  colors = new Map([
    ["dc-pink", "#c16784"],
    ["dc-blue", "#326295"],
    ["dc-green", "#71cc98"],
    ["dc-red", "#c04c36"],
    ["dc-drk-green", "#4b9560"],
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
