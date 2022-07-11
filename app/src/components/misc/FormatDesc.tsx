function FormatDescription({ details }: { details: string }) {
  const urlRegex =
    /((https?|ftp|gopher|telnet|file):((\/\/)|(\\))+[\w\d:#@%/;$()~_?+-=\\.&]*)/gi;

  const text = details
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

  return (
    <p className='text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line'>
      {text}
    </p>
  );
}

export default FormatDescription;
