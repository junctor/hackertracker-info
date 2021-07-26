import { SpeakerBioProps } from "./ht";

const SpeakerDetails = ({ speaker }: SpeakerBioProps) => (
  <div className='cursor-text'>
    <p className='text-xs text-gray-light inline'>{speaker.description}</p>
    {speaker.twitter && (
      <a
        className='text-blue text-xs inline ml-3'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://www.twitter.com/${speaker.twitter}`}>
        {`@${speaker.twitter}`}
      </a>
    )}
  </div>
);
export default SpeakerDetails;
