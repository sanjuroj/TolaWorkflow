/**
 * Page model and methods for working with the jquery datepicker
 * @module Datepicker
 */

class Datepicker {
    constructor () {}

    /**
     * Return the Previous button from the datepicker
     * @returns {WebElement} Clickable Previous button
     */
    get prev() {
        return browser.$('a.ui-datepicker-prev')
    }

    /**
     * Return the Next button from the datepicker
     * @returns {WebElement} Clickable Next button
     */
    get next() {
        return browser.$('a.ui-datepicker-next')
    }

    /**
     * Get the month and year from the datapicker title
     * @returns {String} Current month and year in datepicker
     */
    get currentDatepickerMonthYear() {
        return browser.$('div.ui-datepicker-title')
    }

    /**
     * Get the dates in the datepicker returned as a single string
     * @returns {String} All dates for current month/year in the datepicker
     */
    get dates() {
        return browser.$('a.ui-state-default')
    }

    /**
     * Get the current selected/active date in the datepicker
     * @returns {String} The currently selected date value in the datepicker
     */
    get currentDatepickerDate() {
        return browser.$('a.ui-state-default.ui-state-active')
    }
}
export default new Datepicker()
