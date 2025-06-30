import React, { useState, useEffect } from "react";

export type Video = {
  id: string;
  watched: boolean;
  watchedAt?: string;
};

interface WeeklyChartProps {
  videos: Video[];
}

export default function WeeklyChart({ videos }: WeeklyChartProps) {
  const [counts, setCounts] = useState<number[]>(Array(7).fill(0));

  useEffect(() => {
    const arr = Array(7).fill(0);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    videos.forEach((v) => {
      if (!v.watchedAt) return;

      const watchedDate = new Date(v.watchedAt);
      const watchedLocal = new Date(
        watchedDate.getFullYear(),
        watchedDate.getMonth(),
        watchedDate.getDate()
      );

      const diff = (today.getTime() - watchedLocal.getTime()) / (1000 * 60 * 60 * 24);

      if (diff >= 0 && diff < 7) {
        const day = watchedLocal.getDay(); // 0 = Sun ... 6 = Sat
        arr[day]++;
      }
    });

    setCounts(arr);
  }, [videos]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="weekly-chart">
      <h3>📈 Weekly Activity</h3>
      <div className="bars">
        {counts.map((c, i) => (
          <div key={i} className="bar">
            <div className="inner" style={{ height: `${c * 20}px` }} />
            <span className="label">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
