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
      <A href='/solid/cmyk'>CMYK</A>
      <A href='/solid/rgb'>RGB</A>
      <A href='/solid/xyz'>XYZ</A>
    </nav>
    {props.children}
  </>
);

function loadPage({intent, location}) {
  if (intent === 'initial' || intent === 'navigate') {
    app.className = location.pathname.split('/').pop();
  };
};

render(() =>
  <MetaProvider>
    <Router root={Wrapper}>
      <Route path='/solid/' component={CMYK} load={loadPage}/>
      <Route path='/solid/cmyk' component={CMYK} load={loadPage}/>
      <Route path='/solid/rgb' component={RGB} load={loadPage}/>
      <Route path='/solid/xyz' component={XYZ} load={loadPage}/>
    </Router>
  </MetaProvider>,
  app
);
