import { useRef, useState, type InputHTMLAttributes, type FormEvent } from 'react'

export function normalizePhoneInput(raw: string, allowText = false): string {
  const text = raw.replace(/[０-９]/g, digit => String(digit.charCodeAt(0) - 0xff10)).trim()
  if (allowText && /[^\d\s+()（）\-\u200b-\u200d\ufeff]/.test(text)) return raw
  let digits = text.replace(/\D/g, '')
  if (/^(?:\+86|0086)/.test(text) && digits.length >= 13) {
    digits = digits.slice(text.startsWith('+') ? 2 : 4)
  }
  // Never truncate extra digits into a different, apparently valid phone number.
  return digits
}

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'onInput' | 'type' | 'maxLength' | 'onCompositionStart' | 'onCompositionEnd'> & {
  value: string
  onValueChange: (value: string) => void
  allowText?: boolean
}

/** Keep IME drafts separate from the committed phone used by login/SMS actions. */
export default function PhoneInput({ value, onValueChange, allowText = false, onBlur, ...props }: Props) {
  const composing = useRef(false)
  const [draft, setDraft] = useState(value)
  const published = useRef(value)
  const observed = useRef(value)
  if (observed.current !== value) {
    observed.current = value
    published.current = value
  }
  function commit(element: HTMLInputElement) {
    const next = normalizePhoneInput(element.value, allowText)
    if (element.value !== next) element.value = next
    if (published.current !== next) {
      published.current = next
      onValueChange(next)
    }
    setDraft(next)
  }
  function input(event: FormEvent<HTMLInputElement>) {
    if (composing.current || (event.nativeEvent as InputEvent).isComposing) {
      composing.current = true
      setDraft(event.currentTarget.value)
    } else commit(event.currentTarget)
  }
  return <input
    {...props}
    type={allowText ? 'text' : 'tel'}
    inputMode={props.inputMode || (allowText ? 'text' : 'tel')}
    autoComplete={props.autoComplete || 'tel-national'}
    name={props.name || 'phone'}
    value={composing.current ? draft : value}
    onInput={input}
    onChange={input}
    onCompositionStart={event => { composing.current = true; setDraft(event.currentTarget.value) }}
    onCompositionEnd={event => { composing.current = false; commit(event.currentTarget) }}
    onBlur={event => { composing.current = false; commit(event.currentTarget); onBlur?.(event) }}
  />
}
