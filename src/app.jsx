import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { A, HashRouter, Route } from '@solidjs/router';
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

render(() =>
  <MetaProvider>
    <HashRouter root={Wrapper}>
      <Route path={['/', '/cmyk']} component={CMYK}/>
      <Route path='/rgb' component={RGB}/>
      <Route path='/xyz' component={XYZ}/>
    </HashRouter>
  </MetaProvider>,
  app
);
