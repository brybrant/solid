import { For } from 'solid-js';
import { Title } from '@solidjs/meta';

import SourceButton from '../components/source-button';
import styles from './cmyk.module.scss';

export default () => {
  return (
    <>
      <Title>CMYK</Title>
      <div class={`background ${styles.background}`}>
        <div class={styles.yellow}>
          <For each={Array(100)}>{() => <div />}</For>
        </div>
        <div class={styles.magenta}>
          <For each={Array(100)}>{() => <div />}</For>
        </div>
        <div class={styles.cyan}>
          <For each={Array(100)}>{() => <div />}</For>
        </div>
      </div>
      <main>
        <h1>CMYK</h1>

        <p>By Matt Bryant</p>

        <SourceButton href='/blob/master/src/pages/cmyk.module.scss' />
      </main>
    </>
  );
};
