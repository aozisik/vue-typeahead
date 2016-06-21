'use strict';

var vue = require('vue');

var main = {
  data () {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false,
      queryParamName: 'q'
    }
  },

  computed: {
    hasItems () {
      return this.items.length > 0
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    }
  },

  methods: {
    update () {
      if (!this.query) {
        return this.reset()
      }

      if (this.minChars && this.query.length < this.minChars) {
        return
      }

      this.loading = true

      var that = this;
      this.fetch().then(function(response) {
        if (that.query) {
          var data = response.data
          data = that.prepareResponseData ? that.prepareResponseData(data) : data
          that.items = that.limit ? data.slice(0, that.limit) : data
          that.current = -1
          that.loading = false
        }
      })
    },

    fetch () {
      if (!this.$http) {
        return vue.util.warn('You need to install the `vue-resource` plugin', this)
      }

      if (!this.src) {
        return vue.util.warn('You need to set the `src` property', this)
      }

      var queryParam = {
        [this.queryParamName]: this.query
      }

      return this.$http.get(this.src, Object.assign(queryParam, this.data))
    },

    reset () {
      this.items = []
      this.query = ''
      this.loading = false
    },

    setActive (index) {
      this.current = index
    },

    activeClass (index) {
      return {
        active: this.current == index
      }
    },

    hit () {
      if (this.current !== -1) {
        this.onHit(this.items[this.current])
      }
    },

    up () {
      if (this.current > 0) {
        this.current--
      } else if (this.current == -1) {
        this.current = this.items.length - 1
      } else {
        this.current = -1
      }
    },

    down () {
      if (this.current < this.items.length-1) {
        this.current++
      } else {
        this.current = -1
      }
    },

    onHit () {
      vue.util.warn('You need to implement the `onHit` method', this)
    }
  }
}

module.exports = main;
