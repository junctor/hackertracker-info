interface EventProps {
  event: HTEvent;
}

interface ScheduleProps {
  events: HTEvent[];
}

interface EventsProps {
  dateGroup: [string, HTEvent[]][];
  localTime: boolean;
  timeZOne: string;
}
