import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Heading from "../heading/Heading";
import PageTitle from "../misc/PageTitle";

function NFO() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data: clickData, error } = useSWR("/static/con/clicks.json", fetcher);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "NFO Clicks",
      },
    },
  };

  const barData = {
    labels: (clickData?.badges ?? []).map(
      (b: { owner_handle: string }) => b.owner_handle
    ),
    datasets: [
      {
        label: "Clicks",
        data: (clickData?.badges ?? []).map(
          (b: { clicks: number }) => b.clicks
        ),
        borderColor: "#71cc98",
        backgroundColor: "#c04c36",
      },
    ],
  };

  return (
    <div>
      <Heading />
      <PageTitle title='NFO' />
      <div className='m-10'>
        <Bar options={options} data={barData} />
      </div>
    </div>
  );
}

export default NFO;
