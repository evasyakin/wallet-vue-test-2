class Block {
    constructor(blockData) {
        for (let key in blockData) {
            this[key] = blockData[key]
        }
    }

    test() {
        return this.title
    }
}

module.exports = Block;
