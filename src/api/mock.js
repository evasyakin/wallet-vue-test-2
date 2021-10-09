/**
 * Мокнутые данные для имитации запросов по API.
 */

var blocks = []

for (let i = 0; i < 5; i++) {
    blocks.push({
        id: i + 1,
        title: `Title ${i+1}`,
        content: 'Random content',
        posX: i * 300, posY: 0, posZ: 0,
        sizeX: 300, sizeY: 100,
        intersecting: i < 1 ? false : true, // пересекаемый (может пересекать другие блоки)
    })
}

const desktop = { blocks }

export default { desktop };
