import { Title } from '@solidjs/meta';

import SourceButton from '../components/source-button';
import styles from './xyz.module.scss';

export default function XYZ() {
  return (
    <>
      <Title>XYZ</Title>
      <div class={`background ${styles.background}`}>
        <For each={Array(71)}>{() =>
          <div class={styles.cubeContainer}>
            <div class={styles.cubeTop}/>
          </div>
        }</For>
      </div>
      <main>
        <h1>XYZ</h1>

        <p>By Matt Bryant</p>

        <SourceButton href='/blob/master/src/pages/xyz.module.scss'/>
      </main>
    </>
  );
};
