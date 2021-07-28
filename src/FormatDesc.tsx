import { FormatDescProps } from "./ht";

const FormatDescription = ({ details }: FormatDescProps) => {
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
          className='text-orange hover:text-blue'
          target='_blank'
          rel='noopener noreferrer'
          href={word}>{`${word}`}</a>
      ) : (
        `${word} `
      )
    );

  return <p className='inline'>{text}</p>;
};

export default FormatDescription;
