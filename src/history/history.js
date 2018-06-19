export default class History {
    constructor() {
        this.cursor = -1;
        this.recordes = [];
    }
    addRecord(record) {
        if (record) {
            if (this.cursor + 1 < this.recordes.length) {
                this.recordes = this.recordes.slice(0, this.cursor + 1);
            }
            this.recordes.push(record);
            const len = this.recordes.length;
            this.cursor = len - 1;
        }
        return this;
    }
    undoRecord() {
        let len = this.recordes.length;
        let record = null;
        if (len === 0) {
            this.cursor = -1;
        } else if (len > 0 && this.cursor > -1) {
            record = this.recordes[this.cursor];
            this.cursor = this.cursor - 1;
        }
        return record;
    }
    redoRecord() {
        let len = this.recordes.length;
        let record = null;
        if (len === 0) {
            this.cursor = -1;
        }
        if (len > 0 && this.cursor < len - 1) {
            record = this.recordes[this.cursor + 1];
            this.cursor = this.cursor + 1;
        }
        return record;
    }
    getCurrentRecord() {
        let len = this.recordes.length;
        let record = null;
        if (len === 0) {
            return null;
        }
        if (this.cursor > -1 && this.cursor < len) {
            record = this.recordes[this.cursor];
        }
        return record;
    }
    getAllRecords() {
        return this.recordes;
    }
    clear() {
        this.cursor = -1;
        this.recordes = [];
    }
}