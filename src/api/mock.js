/**
 * Мокнутые данные для имитации запросов по API.
 */

const defaults = {
    sizeX: 300, sizeY: 100,
    between: 10,
}

var blocks = []

for (let i = 0; i < 5; i++) {
    blocks.push({
        id: i + 1,
        title: `Title ${i+1}`,
        content: 'Random content',
        posX: i % 3 * (defaults.sizeX + defaults.between) + defaults.between,
        posY: Math.floor(i / 3) * (defaults.sizeY + defaults.between) + defaults.between, 
        posZ: 0,
        sizeX: defaults.sizeX, sizeY: defaults.sizeY,
        intersecting: i < 1 ? false : true, // пересекаемый (может пересекать другие блоки)
        action: null,
    })
}

const desktop = { blocks }

export default { desktop };
