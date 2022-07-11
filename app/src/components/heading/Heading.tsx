import HeadingLogo from "./HeadingLogo";
import NavLinks from "./NavLinks";

function Heading() {
  return (
    <div className='navbar bg-black sticky top-0 z-50 h-16'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <NavLinks />
        </div>
      </div>
      <div className='navbar-center'>
        <HeadingLogo />
      </div>
      <div className='navbar-end' />
    </div>
  );
}

export default Heading;
