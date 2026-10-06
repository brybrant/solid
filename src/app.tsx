import { onCleanup, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import { A, HashRouter, Navigate, Route } from '@solidjs/router';
import { MetaProvider } from '@solidjs/meta';
import type { ParentComponent } from 'solid-js';

import { OptionsContext, type Options } from './context.tsx';

import CMYK from './pages/cmyk.tsx';
import RGB from './pages/rgb.tsx';
import XYZ from './pages/xyz.tsx';

const Wrapper: ParentComponent = (props) => {
  const options: Options = {
    mouseOver: false,
    mouseX: 0.5,
    mouseY: 1,
    currentX: 0.5,
    currentY: 1,
  };

  /**
   * Callback for `mousemove` document event
   * @param event `MouseEvent`
   */
  const mousemove = (event: MouseEvent) => {
    options.mouseX = event.clientX / window.innerWidth;
    options.mouseY = event.clientY / window.innerHeight;
  };

  /** Callback for `mouseenter` document event */
  const mouseenter = () => {
    options.mouseOver = true;
  };

  /** Callback for `mouseleave` document event */
  const mouseleave = () => {
    options.mouseOver = false;
  };

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
    <OptionsContext.Provider value={options}>
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
