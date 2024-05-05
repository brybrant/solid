import { Title, Link } from '@solidjs/meta';

import GitHubSVG from '../svg/github.svg';
import './cmyk.scss';

export default function CMYK() {
  return (
    <>
      <Title>CMYK</Title>
      <Link href='https://fonts.googleapis.com/css2?family=Kalam:wght@700&family=Protest+Riot&display=swap' rel='stylesheet'/>
      <div class='background'>
        <div class='a'>
          <For each={Array(100)}>{() => <div/>}</For>
        </div>
        <div class='b'>
          <For each={Array(100)}>{() => <div/>}</For>
        </div>
        <div class='c'>
          <For each={Array(100)}>{() => <div/>}</For>
        </div>
      </div>
      <main>
        <h1>CMYK</h1>
        <p>Made with CSS by Matt Bryant</p>
        <a
          class='button'
          href='https://github.com/brybrant/solid/blob/master/src/pages/cmyk.scss'
          target='_blank'
        ><GitHubSVG/>View Source</a>
      </main>
    </>
  );
};
