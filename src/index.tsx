import { Router } from '@solidjs/router'
import { Suspense } from 'solid-js'
import { render } from 'solid-js/web'
import routes from '~solid-pages'

import '~/index.css'

import '@unocss/reset/tailwind.css'
import 'uno.css'

render(
  () => {
    return (
      <Router
        root={props => (
          <Suspense>
            {props.children}
          </Suspense>
        )}
      >
        {routes}
      </Router>
    )
  },
  document.getElementById('root') as HTMLElement,
)
