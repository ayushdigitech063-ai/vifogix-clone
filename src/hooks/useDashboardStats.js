import { defaultStats, defaultEarnings, defaultSeries, publisherUser } from "../data/dashboard";

export const useDashboardStats = () => {
  return {
    user: publisherUser,
    stats: defaultStats,
    earnings: defaultEarnings,
    series: defaultSeries,
    isLoading: false,
  };
};
