import GitHubSVG from '../svg/github.svg';

export default function SourceButton(props) {
  return (
    <a
      class='button'
      href={`https://github.com/brybrant/solid${props.href || ''}`}
      target='_blank'
    ><GitHubSVG/>View Source</a>
  );
};
