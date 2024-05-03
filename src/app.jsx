import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { A, Router, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';

import './app.scss';
const CMYK = lazy(() => import('./pages/cmyk'));
const RGB = lazy(() => import('./pages/rgb'));
const XYZ = lazy(() => import('./pages/xyz'));

const App = props => (
  <>
    <nav>
      <A href='/cmyk'>CMYK</A>
      <A href='/rgb'>RGB</A>
      <A href='/xyz'>XYZ</A>
    </nav>
    {props.children}
  </>
);

render(() =>
  <MetaProvider>
    <Router root={App}>
      <Route path='/' component={CMYK} />
      <Route path='/cmyk' component={CMYK} />
      <Route path='/rgb' component={RGB} />
      <Route path='/xyz' component={XYZ} />
    </Router>
  </MetaProvider>,
  document.getElementById('app')
);
