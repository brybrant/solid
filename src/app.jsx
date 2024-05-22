import { render } from 'solid-js/web';
import { A, HashRouter, Navigate, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';

import './app.scss';

import CMYK from './pages/cmyk';
import RGB from './pages/rgb';
import XYZ from './pages/xyz';

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
      <Route path='/cmyk' component={CMYK}/>
      <Route path='/rgb' component={RGB}/>
      <Route path='/xyz' component={XYZ}/>
      <Route path='/' component={() => <Navigate href='/cmyk'/>}/>
    </HashRouter>
  </MetaProvider>,
  document.getElementById('app')
);
