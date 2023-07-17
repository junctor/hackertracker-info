function FormatDescription({ details }: { details: string }) {
  const urlRegex =
    /((https?|ftp|gopher|telnet|file):((\/\/)|(\\))+[\w\d:#@%/;$()~_?+-=\\.&]*)/gi;

  const ahrefRefex = /(<a href=")(.+)(">)(.+)(<\/a>)/gi;

  const text = details
    .replaceAll("<br />", "\n")
    .replace(ahrefRefex, "$4")

    .split(/(\s+)/)
    .map((word) =>
      urlRegex.test(word) ? (
        <a
          key={word}
          className="text-dc-purple hover:text-dc-teal"
          target="_blank"
          rel="noopener noreferrer"
          href={word}
        >{`${word}`}</a>
      ) : (
        `${word} `
      )
    );

  return (
    <p className="text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre-line">
      {text}
    </p>
  );
}

export default FormatDescription;
