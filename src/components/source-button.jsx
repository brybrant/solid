import GitHubSVG from '@brybrant/svg-icons/GitHub.svg';

/**
 * @param {object} props
 * @param {string} props.href
 */
export default function SourceButton(props) {
  return (
    <a
      class='button'
      href={`https://github.com/brybrant/solid${props.href || ''}`}
      target='_blank'
      innerHTML={GitHubSVG} // eslint-disable-line solid/no-innerhtml
    />
  );
}
