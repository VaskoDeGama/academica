class DTO {
  /**
   *
   * @param {object} params
   * @param {boolean} [params.success=false]
   * @param {Error} [params.error]
   * @param {any} [params.data]
   */
  constructor ({ success = false, error, data }) {
    this.success = success

    if (data !== undefined) {
      this.data = data
    }

    if (error !== undefined) {
      this.errors = [{ error, msg: error.message }]
    }
  }
}

module.exports = DTO
