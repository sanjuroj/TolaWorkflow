/**
 * Page model and methods for working with the jquery datepicker
 * @module Datepicker
 */

class Datepicker {
  constructor() {
  }

  /**
   * Return the Previous button from the datepicker as a WebElement
   * @returns {WebElement} Clickable Previous button
   */
  get prev() {
    return browser.$('a.ui-datepicker-prev')
  }

  /**
   * Return the Next button from the datepicker as a WebElement
   * @returns {WebElement} Clickable Next button
   */
  get next() {
    return browser.$('a.ui-datepicker-next')
  }

  /**
   * Return the month and year from the datapicker titlebar
   * @returns {String} Current month and year in datepicker
   */
  get currentDatepickerMonthYear() {
    return browser.$('div.ui-datepicker-title')
  }

  /**
   * Get the currently selected/active date in the datepicker
   * @returns {String} The currently selected date value in the datepicker
   */
  get currentDatepickerDate() {
    return browser.$('a.ui-state-default.ui-state-active')
  }
}

export default new Datepicker()
