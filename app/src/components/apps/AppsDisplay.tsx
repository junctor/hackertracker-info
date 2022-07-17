/* eslint-disable @next/next/no-img-element */
function AppsDisplay() {
  return (
    <div className='mt-10'>
      <div className='text-center'>
        <h1 className='text-6xl sm:text-7xl md:text-8xl llg:text-9xl font-mono'>
          Hacker Tracker
        </h1>
        <h1 className='text-base sm:text-lg md:text-xl llg:text-2xl font-mono my-2 text-dc-blue'>
          The official DEF CON app
        </h1>
        <div className='flex place-items-center items-center justify-center mt-5'>
          <div className=''>
            <a href='https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US'>
              <img
                src='/static/img/appstore-badge.svg'
                width='150px'
                alt='Download on the App Store'
              />
            </a>
          </div>
          <div>
            <a href='https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US'>
              <img
                src='/static/img/google-play-badge.png'
                width='190px'
                alt='Get it on Google Play'
              />
            </a>
          </div>
        </div>
        <div className='text-xs sm:text-sm md:text-sm lg:text-base mt-10'>
          <p className='my-1'>
            App Store and the App Store logo are registered trademarks of Apple
            Inc.
          </p>
          <p className='my-1'>
            Google Play and the Google Play logo are trademarks of Google LLC.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppsDisplay;
