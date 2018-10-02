/**
 * Page model and methods for working with the jquery datepicker
 * @module Datepicker
 */

class Datepicker {

    get prev() {
        return browser.$('a.ui-datepicker-prev')
    }

    get next() {
        return browser.$('a.ui-datepicker-next')
    }

    get currentDatepickerDate() {
        return browser.$('div.ui-datepicker-title')
    }

    get dates() {
        return browser.$('a.ui-state-default')
    }
}
export default new Datepicker()
