export default function Footer() {
  const { isDark, toggleDark } = useDark()
  return (
    <nav class="mt-6 w-full inline-flex justify-center gap-2 text-xl">
      <button class="icon-btn !outline-none" onClick={() => toggleDark()}>
        {isDark() ? <div class="icon-btn i-carbon-moon" /> : <div class="icon-btn i-carbon-sun" />}
      </button>

      <a
        class="icon-btn i-carbon-logo-github"
        rel="noreferrer"
        href="https://github.com"
        target="_blank"
        title="GitHub"
      />
    </nav>

  )
}
