import { onCleanup, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import { A, HashRouter, Navigate, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';

import './app.scss';

import { mouseenter, mouseleave, mousemove } from './components/canvas';

import CMYK from './pages/cmyk';
import RGB from './pages/rgb';
import XYZ from './pages/xyz';

const Wrapper = (props) => {
  onMount(() => {
    document.body.addEventListener('mouseenter', mouseenter);
    document.body.addEventListener('mouseleave', mouseleave);
    document.body.addEventListener('mousemove', mousemove);
  });

  onCleanup(() => {
    document.body.removeEventListener('mouseenter', mouseenter);
    document.body.removeEventListener('mouseleave', mouseleave);
    document.body.removeEventListener('mousemove', mousemove);
  });

  return (
    <>
      <div class='nav__blur' />
      <nav>
        <A href='/cmyk'>
          CMYK
          <div />
        </A>
        <A href='/rgb'>
          RGB
          <div />
        </A>
        <A href='/xyz'>
          XYZ
          <div />
        </A>
      </nav>
      {props.children}
    </>
  );
};

const dispose = render(
  () => (
    <MetaProvider>
      <HashRouter root={Wrapper}>
        <Route path='/cmyk' component={CMYK} />
        <Route path='/rgb' component={RGB} />
        <Route path='/xyz' component={XYZ} />
        <Route path='/' component={() => <Navigate href='/cmyk' />} />
      </HashRouter>
    </MetaProvider>
  ),
  document.getElementById('app'),
);

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
