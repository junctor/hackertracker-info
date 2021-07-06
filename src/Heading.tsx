import { HeadingLink } from "./ht";

const headingLinks: HeadingLink[] = [
  {
    href: "https://defcon.org/html/defcon-29/dc-29-index.html",
    text: "DEF CON 29",
  },
];

export const Heading = () => (
  <nav className='flex items-center justify-between flex-wrap p-5'>
    <div className='flex items-center flex-shrink-0 text-gray-light mr-5'>
      <span className='font-bold text-5xl'>info.defcon.org</span>
    </div>
    <div className='w-6/12 block flex-grow lg:flex lg:items-center lg:w-auto'>
      <div className='text-sm lg:flex-grow'>
        {headingLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className='block mt-4 lg:inline-block hover:text-blue text-red mr-4'>
            {link.text}
          </a>
        ))}
      </div>
    </div>
  </nav>
);
export default Heading;
