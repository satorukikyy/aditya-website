// Smoke test: verify tailwind config exports the neobrutalist design tokens
import config from '../tailwind.config'

test('tailwind config has neobrutalist base colors', () => {
  const colors = config.theme?.extend?.colors as Record<string, unknown>
  expect(colors['c-bg']).toBe('#FAF3E8')
  expect(colors['c-surface']).toBe('#FFFFFF')
  expect(colors['c-text']).toBe('#0D0D0D')
  expect(colors['c-border']).toBe('#0D0D0D')
  expect(colors['c-purple']).toBe('#7C3AED')
  expect(colors['c-purple-light']).toBe('#EDE9FE')
})

test('tailwind config has neobrutalist accent colors', () => {
  const colors = config.theme?.extend?.colors as Record<string, unknown>
  expect(colors['c-yellow']).toBe('#FFD12E')
  expect(colors['c-pink']).toBe('#FF8FD8')
  expect(colors['c-cyan']).toBe('#7AE1EA')
  expect(colors['c-lime']).toBe('#B5F163')
})

test('tailwind config has hard brutal shadows (no blur)', () => {
  const shadows = config.theme?.extend?.boxShadow as Record<string, string>
  expect(shadows['brutal-sm']).toBe('3px 3px 0 0 #0D0D0D')
  expect(shadows['brutal']).toBe('5px 5px 0 0 #0D0D0D')
  expect(shadows['brutal-lg']).toBe('8px 8px 0 0 #0D0D0D')
})

test('tailwind config has display, body, and mono font stacks', () => {
  const fonts = config.theme?.extend?.fontFamily as Record<string, string[]>
  expect(fonts['display'][0]).toBe('var(--font-display)')
  expect(fonts['body'][0]).toBe('var(--font-body)')
  expect(fonts['mono'][0]).toBe('var(--font-mono)')
})
