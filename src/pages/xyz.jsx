import { Title, Link } from '@solidjs/meta';

import GitHubSVG from '../svg/github.svg';
import './xyz.scss';

export default function XYZ() {
  return (
    <div class='xyz'>
      <Title>XYZ</Title>
      <Link href='https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Outfit:wght@700&display=swap' rel='stylesheet'/>
      <div class='background'>
        <For each={Array(71)}>{() =>
          <div class='a'><div class='b'/></div>
        }</For>
      </div>
      <main>
        <h1>XYZ</h1>
        <p>Made with CSS by Matt Bryant</p>
        <a
          class='button'
          href={`${__GITHUB__}/blob/master/src/pages/xyz.scss`}
          target='_blank'
        ><GitHubSVG/>View Source</a>
      </main>
    </div>
  );
};
