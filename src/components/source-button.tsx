import GitHubSVG from '@brybrant/svg-icons/GitHub.svg';

export default (props: { href: string }) => {
  return (
    <a
      class='button'
      href={`https://github.com/brybrant/solid${props.href || ''}`}
      target='_blank'
      innerHTML={GitHubSVG} // eslint-disable-line solid/no-innerhtml
    />
  );
};
