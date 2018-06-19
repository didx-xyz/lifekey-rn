/* global global */
/* eslint-disable no-console */

import { shallow, render, mount } from "enzyme"

global.shallow = shallow
global.render = render
global.mount = mount

// Fail tests on any warning
console.error = function(message) {
  throw new Error(message)
}
