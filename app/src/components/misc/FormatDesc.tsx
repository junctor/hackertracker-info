const FormatDescription = ({ details }: { details: string }) => {
  const urlRegex = new RegExp(
    "((https?|ftp|gopher|telnet|file):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\\\.&]*)",
    "ig"
  );

  const text = details
    .replaceAll("\n", " ")
    .split(/(\s+)/)
    .map((word) =>
      urlRegex.test(word) ? (
        <a
          key={word}
          className='text-dc-pink hover:text-dc-blue'
          target='_blank'
          rel='noopener noreferrer'
          href={word}>{`${word}`}</a>
      ) : (
        `${word} `
      )
    );

  return <>{text}</>;
};

export default FormatDescription;
