import NavLinks from "./NavLinks";
import { EventSearch } from "./EventSearch";

export const EventHeading = ({ events }: EventHeadingProps) => {
  return (
    <header className='sticky top-0 z-50 pb-2'>
      <nav className='flex bg-black h-20 items-center justify-around py-1'>
        <div className='flex-none ml-1'>
          <div>
            <NavLinks />
          </div>
        </div>
        <div className='flex-1 my-auto'>
          <div className='text-center'>
            <h1 className='text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono'>
              D<span className='text-dc-red'>3</span>F C
              <span className='text-dc-red'>0</span>N
            </h1>
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
