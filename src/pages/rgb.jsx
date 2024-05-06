import { Title, Link } from '@solidjs/meta';

import './rgb.scss';

export default function RGB() {
  return (
    <div class='rgb'>
      <Title>RGB</Title>
      <Link href='https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Jersey+10&display=swap' rel='stylesheet'/>
      <div class='background'>
        <For each={Array(256)}>{() => <div class='a'/>}</For>
      </div>
      <main>
        <h1>RGB</h1>
        <p>Made with CSS by Matt Bryant</p>
        <a
          class='button'
          href='https://github.com/brybrant/solid/blob/master/src/pages/rgb.scss'
          target='_blank'
        >View Source</a>
      </main>
    </div>
  );
};
