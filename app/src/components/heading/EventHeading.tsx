import NavLinks from "./NavLinks";
import { EventSearch } from "./EventSearch";

export const EventHeading = ({ events, title }: EventHeadingProps) => {
  return (
    <header className='sticky top-0 z-50 '>
      <nav className='flex bg-black h-20 items-center justify-around pt-2'>
        <div className='flex-none ml-1'>
          <div>
            <NavLinks />
          </div>
        </div>
        <div className='flex-1 my-auto'>
          <div className='text-center'>
            <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold font-mono'>
              D<span className='text-dc-red'>3</span>F C
              <span className='text-dc-red'>0</span>N
            </p>
          </div>
        </div>
        <div className='flex text-right mr-5'>
          <EventSearch events={events} />
        </div>
      </nav>
    </header>
  );
};

export default EventHeading;
