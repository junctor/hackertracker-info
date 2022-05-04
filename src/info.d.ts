interface ConfInfo {
  villages: Village[];
}

interface Village {
  name: string;
  home: string;
  forum: string;
  twitter: string;
  discord: string;
  youtube: string;
}

interface Timer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
