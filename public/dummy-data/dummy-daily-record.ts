export const dummyDailyRecords: Record<string, any> = {
  "2025-09-09": {
    date: "2025-09-09",
    records: [
      {
        recordId: 1,
        exercise_type: "LUNGE",
        start_time: "2025-09-09T09:00:00",
        video_path: "https://s3.aws.com/repit/videos/pushup1.mp4",
        analysis_path: "/path/to/analysis1.txt",
      },
    ],
  },
  "2025-09-10": {
    date: "2025-09-10",
    records: [
      {
        recordId: 2,
        exercise_type: "SQUAT",
        start_time: "2025-09-10T14:20:10",
        video_path: "https://s3.aws.com/repit/videos/squat1.mp4",
        analysis_path: "/path/to/analysis2.txt",
      },
      {
        recordId: 3,
        exercise_type: "SQUAT",
        start_time: "2025-09-10T15:10:00",
        video_path: "https://s3.aws.com/repit/videos/squat2.mp4",
        analysis_path: "/path/to/analysis3.txt",
      },
    ],
  },
  "2025-09-23": {
    date: "2025-09-23",
    records: [
      {
        recordId: 4,
        exercise_type: "PLANK",
        start_time: "2025-09-23T08:30:00",
        video_path: "https://s3.aws.com/repit/videos/deadlift1.mp4",
        analysis_path: "/path/to/analysis4.txt",
      },
      {
        recordId: 5,
        exercise_type: "SQUAT",
        start_time: "2025-09-23T10:00:00",
        video_path: "https://s3.aws.com/repit/videos/deadlift2.mp4",
        analysis_path: "/path/to/analysis5.txt",
      },
      {
        recordId: 6,
        exercise_type: "PLANK",
        start_time: "2025-09-23T11:30:00",
        video_path: "https://s3.aws.com/repit/videos/pushup2.mp4",
        analysis_path: "/path/to/analysis6.txt",
      },
      {
        recordId: 7,
        exercise_type: "LUNGE",
        start_time: "2025-09-23T14:20:10",
        video_path: "https://s3.aws.com/repit/videos/squat3.mp4",
        analysis_path: "/path/to/analysis7.txt",
      },
    ],
  },
};
