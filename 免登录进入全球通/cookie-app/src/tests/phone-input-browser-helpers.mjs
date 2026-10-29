import assert from 'node:assert/strict'

// Exercise replacement events through the element's own setter too: mobile
// autofill can update React's value tracker before its synthetic change event.
export async function exercisePhoneInput(input) {
  await input.fill('')
  async function insert(text, composing = false) {
    await input.evaluate((element, { text, composing }) => {
      element.value = text
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: composing ? 'insertCompositionText' : 'insertReplacementText', data: text, isComposing: composing }))
    }, { text, composing })
  }
  await insert('13800000000')
  // Cross the page's regular timer render: DOM-only values used to disappear.
  await input.page().waitForTimeout(1100)
  assert.equal(await input.inputValue(), '13800000000', 'quick fill survives parent renders')
  await input.fill('')
  await input.evaluate(element => element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })))
  await insert('shouji', true)
  assert.equal(await input.inputValue(), 'shouji', 'IME draft is not stripped')
  await insert('１３８００００００００', true)
  assert.equal(await input.inputValue(), '１３８００００００００', 'full-width draft stays intact until confirmation')
  await input.evaluate(element => element.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: element.value })))
  assert.equal(await input.inputValue(), '13800000000', 'IME result commits as ASCII digits')
  for (const text of ['+86 138 0000 0000', '0086-138-0000-0000', '138 0000 0000', '１３８００００００００']) {
    await insert(text)
    assert.equal(await input.inputValue(), '13800000000', `formatted autofill: ${text}`)
  }
  await insert('138000000001')
  assert.equal(await input.inputValue(), '138000000001', 'extra digits cannot become a different valid number')
  await input.fill('13800000000')
}
