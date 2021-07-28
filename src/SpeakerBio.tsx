import FormatDesc from "./FormatDesc";
import { SpeakerBioProps } from "./ht";

const SpeakerDetails = ({ speaker }: SpeakerBioProps) => (
  <div className='cursor-text '>
    <div className='text-xs text-gray-light'>
      <FormatDesc details={speaker.description} />
    </div>
    {speaker.twitter && (
      <a
        className='text-blue text-xs'
        target='_blank'
        rel='noopener noreferrer'
        href={`https://www.twitter.com/${speaker.twitter}`}>
        {`@${speaker.twitter}`}
      </a>
    )}
  </div>
);
export default SpeakerDetails;
