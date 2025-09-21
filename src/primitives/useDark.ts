import { usePrefersDark } from '@solid-primitives/media'
import { makePersisted } from '@solid-primitives/storage'

export default function useDark() {
  const prefersDark = usePrefersDark()

  const [value, setValue] = makePersisted(createSignal<string>('auto'), {
    storage: localStorage,
    name: 'theme',
  })
  const isDark = createMemo(() => value() === 'auto' ? prefersDark() : value() === 'dark')

  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDark())
    document.documentElement.setAttribute('data-theme', isDark() ? 'dark' : 'light')
  })
  const toggleDark = () => setValue(isDark() ? 'light' : 'dark')

  return {
    isDark,
    toggleDark,
  }
}
