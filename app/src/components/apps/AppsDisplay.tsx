export default function AppsDisplay() {
  return (
    <div className="mt-10">
      <div className="text-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl llg:text-9xl font-mono">
          Hacker Tracker
        </h1>
        <h1 className="text-base sm:text-lg md:text-xl llg:text-2xl font-mono my-2 text-dc-purple">
          The official DEF CON app
        </h1>
        <div className="flex place-items-center items-center justify-center mt-10 flex-col md:flex-row">
          <a
            href="https://itunes.apple.com/us/app/hackertracker/id1021141595?mt=8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              type="button"
              className="m-2 bg-dc-red p-5 rounded-2xl font-bold text-xl w-48 hover:bg-dc-yellow hover:text-black"
            >
              iOS
            </button>
          </a>
          <div>
            <a
              href="https://play.google.com/store/apps/details?id=com.shortstack.hackertracker&hl=en_US"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="m-2 bg-dc-teal p-5 rounded-2xl font-bold text-xl w-48 hover:bg-dc-yellow hover:text-black"
              >
                Android
              </button>
            </a>
          </div>
          <div>
            <a
              href="https://info.defcon.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="m-2 bg-dc-purple p-5 rounded-2xl font-bold text-xl w-48 hover:bg-dc-yellow hover:text-black"
              >
                Web
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
