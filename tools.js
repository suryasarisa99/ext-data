class D {
  constructor(sy, year, sem, type = "results") {
    this.sy = sy;
    this.year = year;
    this.sem = sem;
    this.type = type;
    this.startYear = sy;
  }
  get fsem() {
    return `${this.year}-${this.sem}`;
  }
  get txtFile() {
    return `text-data/${this.sy}-${this.year}-${this.sem}-${this.type}`;
  }
  get extFile() {
    return `ext-data/${this.sy}-${this.year}-${this.sem}-ext-data`;
  }
  get dbFile() {
    return `db-data/${this.sy}-db-data`;
  }
  get sdbFile() {
    return `db-data/${this.sy}-${this.year}-${this.sem}-db-data`;
  }
  get aysFile() {
    return `ays-data/${this.sy}-ays-data`;
  }
  get mergedFile() {
    return `merged-data/${this.sy}-merged-data`;
  }
  get cmpFile() {
    return `complete-data/${this.sy}-cmp-data`;
  }
}

module.exports = new D(21, 1, 1);
