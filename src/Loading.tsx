import { LoadingProps } from "./ht";

const Loading = ({ conf }: LoadingProps) => (
  <div id='loading'>
    <h2>Loading {conf}...</h2>
  </div>
);

export default Loading;
