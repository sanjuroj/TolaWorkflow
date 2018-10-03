import { assert } from 'chai'
import IndPage from '../pages/indicators.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'

describe('Report filter panel', function() {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should have default sort order of level, number, and name')
  it('should be manually sortable by level')
  it('should be manually sortable by name')
  it('should be manually sortable by number')
  it('should be sortable by clicking a column header')
})
