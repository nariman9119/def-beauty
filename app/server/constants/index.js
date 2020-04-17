const keyMirror = require('key-mirror')

const TRADE_STEP_STATE = keyMirror({
  CURRENT: null,
  OPENED: null,
  CLOSED: null
})

const COMMODITY_TYPES = ['Avocado', 'Mango', 'Lychee', 'Tangerine']
const COMMODITY_CONDITIONS = ['GOOD']
const colors = ['green', 'blue', 'orange', 'green-reverse', 'red', 'orange-reverse', 'red-reverse']

exports.TRADE_STEP_STATE = TRADE_STEP_STATE
exports.COMMODITY_TYPES = COMMODITY_TYPES
exports.COMMODITY_CONDITIONS = COMMODITY_CONDITIONS
exports.colors = colors
