const { readFile, writeFile } = require("fs").promises;

class HeroRopository {
  constructor({ file }) {
    this.file = file;
  }

  async _currentFileContent() {
    const content = await readFile(this.file, "utf8");
    return JSON.parse(content);
  }

  async find(itemId) {
    const all = await this._currentFileContent();
    if (!itemId) return all;

    return all.find(({ id }) => itemId === id);
  }

  async create(data) {
    const currentFile = await this._currentFileContent();
    currentFile.push(data);

    await writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }
}

module.exports = HeroRopository;
