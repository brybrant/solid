import { batch, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';
import { A, HashRouter, Navigate, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';

import './app.scss';

import { OptionsContext } from './context';

import CMYK from './pages/cmyk';
import RGB from './pages/rgb';
import XYZ from './pages/xyz';

/**
 * @typedef {import('./context').Options} Options
 */

const Wrapper = (props) => {
  /** @type {[Options, import('solid-js/store').SetStoreFunction<Options>]} */
  const [options, setOptions] = createStore({
    mouseOver: false,
    mouseX: 0.5,
    mouseY: 1,
    canvasX: 0.5,
    canvasY: 1,
  });

  /**
   * Callback for `mousemove` document event
   * @param {MouseEvent} event
   */
  function mousemove(event) {
    return batch(() => {
      setOptions('mouseX', event.clientX / window.innerWidth);
      setOptions('mouseY', event.clientY / window.innerHeight);
    });
  }

  /** Callback for `mouseenter` document event */
  const mouseenter = () => setOptions('mouseOver', true);

  /** Callback for `mouseleave` document event */
  const mouseleave = () => setOptions('mouseOver', false);

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
    <OptionsContext.Provider value={[options, setOptions]}>
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
    </OptionsContext.Provider>
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
