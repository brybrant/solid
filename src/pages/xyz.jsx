import { Title } from '@solidjs/meta';

import SourceButton from '../components/source-button';
import styles from './xyz.module.scss';

export default () => {
  return (
    <>
      <Title>XYZ</Title>
      <div class={`background ${styles.background}`}>
        <For each={Array(71)}>{() =>
          <div class={styles.cube_container}>
            <div class={styles.cube_top}/>
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
