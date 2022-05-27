import NavLinks from "./NavLinks";

export function Heading() {
  return (
    <div className='navbar bg-base-100 sticky top-0 h-14 z-50'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <NavLinks />
        </div>
      </div>
      <div className='navbar-center'>
        <p className='text-lg'>DEF CON 30</p>
      </div>
      <div className='navbar-end' />
    </div>
  );
}

export default Heading;
