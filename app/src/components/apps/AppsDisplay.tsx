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
        <div className='flex place-items-center items-center justify-center mt-10 flex-col md:flex-row'>
          <a href='https://itunes.apple.com/us/app/hackertracker/id1021141595?mt=8'>
            <button
              type='button'
              className='m-2 bg-dc-red p-5 rounded-2xl font-bold text-xl w-48 hover:bg-dc-drk-green'>
              iOS
            </button>
          </a>
          <div>
            <a href='https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US'>
              <button
                type='button'
                className='m-2 bg-dc-blue p-5 rounded-2xl font-bold text-xl w-48 hover:bg-dc-drk-green'>
                Android
              </button>
            </a>
          </div>
        </div>
        <div className='text-sm lg:text-base mt-10 mx-5'>
          <p className='my-1'>
            App Store and the App Store logo are registered trademarks of Apple
            Inc.
          </p>
          <p className='my-2'>
            Google Play and the Google Play logo are trademarks of Google LLC.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppsDisplay;
