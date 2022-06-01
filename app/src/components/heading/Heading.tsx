import NavLinks from "./NavLinks";
import { SearchIcon } from "@heroicons/react/outline";

export function Heading() {
  return (
    <div className='navbar bg-black sticky top-0 z-50'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <NavLinks />
        </div>
      </div>
      <div className='navbar-center'>
        <p className='text-2xl text-white'>DEF CON 30</p>
      </div>
      <div className='navbar-end'>
        <SearchIcon className='h-6 w-6 mr-3 text-white' />
      </div>
    </div>
  );
}

export default Heading;
