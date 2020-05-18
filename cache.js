class Cache {
  constructor (size) {
    this._cached = {}
    this.size = size // disabled
    this.enabled = size > 0
    this.hits = 0
    this.misses = 0
    this.recentKeys = []
  }

  _generateKey (params) {
    return params.map(obj => JSON.stringify(obj)).join('_')
  }

  flush () {
    this._cached = {}
  }

  _updateRecentKey (keyName) {
    const index = this.recentKeys.indexOf(keyName)
    if (index !== -1) {
      this.recentKeys.splice(index, 1)
    }
    this.recentKeys.splice(0, 0, keyName)
  }

  _updateCache () {
    if (this.recentKeys.length < this.size) { return false }
    const recentKey = this.recentKeys.pop()
    delete this._cached[recentKey]
    return true
  }

  get (params, promise) {
    if (!this.enabled) { return promise() }
    const cacheKey = this._generateKey(params)
    this._updateRecentKey(cacheKey)
    if (this._cached[cacheKey] !== undefined) {
      this.hits++
      return Promise.resolve(this._cached[cacheKey])
    }
    return promise().then((value) => {
      this.misses++
      this._cached[cacheKey] = value
      this._updateCache()
      return value
    })
  }
}

module.exports = Cache
