import { Title } from '@solidjs/meta';

import SourceButton from '../components/source-button';
import styles from './rgb.module.scss';

export default () => {
  return (
    <>
      <Title>RGB</Title>
      <div class={`background ${styles.background}`}>
        <For each={Array(256)}>{() =>
          <div class={styles.pixel}/>
        }</For>
      </div>
      <main>
        <h1>RGB</h1>

        <p>By Matt Bryant</p>

        <SourceButton href='/blob/master/src/pages/rgb.module.scss'/>
      </main>
    </>
  );
};
