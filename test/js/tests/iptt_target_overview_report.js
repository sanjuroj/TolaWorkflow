import IpttPage from '../pages/iptt.page'
import IndPage from '../pages/indicators.page'
import LoginPage from '../pages/login.page'
import NavBar from '../pages/navbar.page'
import TargetsTab from '../pages/targets.page'
import Util from '../lib/testutil'

/**
 * IPTT report: Program target overview report
 * Tests from mc/issues/119
 */
describe('IPTT report: Program target overview report', function() {
  // Disable timeouts
  this.timeout(0)

  before(function () {
    browser.windowHandleMaximize()
    Util.loginTola()
  })

  it('should only show indicator combos with compatible target periods')
  it('should not show indicator combos with incompatible target periods')
  it('should show indicators with compatible and incompatible target periods in separate tables')
})
