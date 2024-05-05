import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { A, Router, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';

import './app.scss';
const CMYK = lazy(() => import('./pages/cmyk'));
const RGB = lazy(() => import('./pages/rgb'));
const XYZ = lazy(() => import('./pages/xyz'));

const app = document.getElementById('app');

const Wrapper = props => (
  <>
    <div class='nav-blur'/>
    <nav>
      <A href='/cmyk'>CMYK</A>
      <A href='/rgb'>RGB</A>
      <A href='/xyz'>XYZ</A>
    </nav>
    {props.children}
  </>
);

function loadPage({intent, location}) {
  if (intent === 'initial' || intent === 'navigate') {
    app.className = location.pathname.slice(1);
  };
};

render(() =>
  <MetaProvider>
    <Router root={Wrapper}>
      <Route path='/' component={CMYK} load={loadPage}/>
      <Route path='/cmyk' component={CMYK} load={loadPage}/>
      <Route path='/rgb' component={RGB} load={loadPage}/>
      <Route path='/xyz' component={XYZ} load={loadPage}/>
    </Router>
  </MetaProvider>,
  app
);
