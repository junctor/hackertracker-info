import { useState } from "react";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/outline";
import { Theme } from "./theme";
import { headingLinks, sideLinks } from "./links";

export const Heading = () => {
  const [menu, setMenu] = useState(false);

  const theme = new Theme();

  return (
    <nav className='flex items-center justify-between flex-wrap p-6'>
      <div className='flex items-center flex-shrink-0 text-gray-light mr-5 mt-3'>
        <span className='font-bold text-5xl'>info.defcon.org</span>
      </div>
      <div className='w-6/12 block flex-grow lg:flex lg:items-center lg:w-auto'>
        <div className='text-sm lg:flex-grow'>
          {headingLinks.map((link) => (
            <a
              target='_blank'
              rel='noopener noreferrer'
              key={link.href}
              href={link.href}
              className={`block mt-4 lg:inline-block text-${theme.color} hover:text-gray-light mr-4`}>
              {link.text}
            </a>
          ))}
        </div>
      </div>
      <div className={`${menu === true ? "block" : "hidden"} w-full flex-grow`}>
        <div className='text-sm lg:flex-grow'>
          {sideLinks().map((sl) => (
            <div key={sl.heading}>
              <p className='text-lg mt-6 text-blue'>{sl.heading}</p>
              {sl.links.map((l) => (
                <a
                  key={l.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  href={l.href}
                  className={`block mt-1 ml-2 text-gray-light hover:text-${theme.color}`}>
                  {l.text}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div>
        {menu ? (
          <ChevronDoubleUpIcon
            className='ml-3 mt-3 mr-3 h-12 w-12 inline-block text-orange cursor-pointer'
            onClick={() => setMenu(!menu)}
          />
        ) : (
          <ChevronDoubleDownIcon
            className='ml-3 mt-3 mr-3 h-12 w-12 inline-block text-orange cursor-pointer'
            onClick={() => setMenu(!menu)}
          />
        )}
      </div>
    </nav>
  );
};

export default Heading;
