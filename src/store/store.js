import Store from '../core/Store'
import Desktop from './Desktop'

const desktop = new Desktop
desktop.init()

export default new Store({ desktop })
