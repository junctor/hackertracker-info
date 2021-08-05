import dcMap from "./static/dc-29-map.pdf";

const Map = () => (
  <div className='m-7 items-center text-center'>
    <div className='mt-5 mb-5'>
      <a
        href={dcMap}
        target='_blank'
        rel='noopener noreferrer'
        className='inline mr-2 text-orange'>
        Open Map in New Tab
      </a>
      /
      <a href={dcMap} className='text-green ml-2' download>
        Dowload Map
      </a>
    </div>
    <embed src={dcMap} width='100%' height='300px' type='application/pdf' />
  </div>
);

export default Map;
