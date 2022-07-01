import NavLinks from "./NavLinks";
import { EventSearch } from "./EventSearch";

export const EventHeading = ({ events, title }: EventHeadingProps) => {
  return (
    <div className='navbar bg-black sticky top-0 z-50 h-20'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <NavLinks />
        </div>
      </div>
      <div className='navbar-center'>
        <div className='text-center items-center '>
          <p className='md:text-4xl lg:text-5xl text-white font-bold font-mono'>
            D<span className='text-dc-red'>3</span>F C
            <span className='text-dc-red'>0</span>N
          </p>
          <p className={`md:text-lg lg:text-xl text-white font-mono`}>
            {title}
          </p>
        </div>
      </div>
      <div className='navbar-end'>
        <EventSearch events={events} />
      </div>
    </div>
  );
};

export default EventHeading;
