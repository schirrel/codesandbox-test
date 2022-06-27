export default {
  methods: {
    utilRoundDecimal (nDigits, value) {
      const n = parseInt(nDigits)
      let v = parseFloat(value)
      v = v * Math.pow(10, n)
      v = Math.round(v)
      return v / Math.pow(10, n)
    },
    utilFormattedTime (date) {
      if (date === undefined) date = Date()

      const y = date.getFullYear()
      const m = (date.getMonth() + 1).toString().padStart(2, '0')
      const d = date.getDate().toString().padStart(2, '0')
      const h = date.getHours().toString().padStart(2, '0')
      const mi = date.getMinutes().toString().padStart(2, '0')
      const s = date.getSeconds().toString().padStart(2, '0')

      return y + '-' + m + '-' + d + '_' + h + '-' + mi + '-' + s
    },
    utilExtractYear (date) {
      if (!date || typeof date !== 'string') return 0

      const array = date.split('-')

      if (array.length !== 3 || array[0].length !== 4 || typeof array[0] !== 'string') return 0

      return parseInt(array[0])
    }
  }
}
