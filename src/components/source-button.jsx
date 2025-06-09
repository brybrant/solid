import GitHubSVG from '../../node_modules/@brybrant/svg-icons/GitHub.svg';

export default function SourceButton(props) {
  return (
    <a
      class='button'
      href={`https://github.com/brybrant/solid${props.href || ''}`}
      target='_blank'
    >
      <GitHubSVG />
    </a>
  );
}
