import Session from "./Session"

test("update state twice without losing data", () => {
  Session.update({ one: 1, two: 2, three: 3 })
  Session.update({ two: 2, four: 4, three: 3 })

  const state = Session.getState()

  expect(JSON.stringify(state)).toBe(
    JSON.stringify({ one: 1, two: 2, three: 3, four: 4 })
  )
})
