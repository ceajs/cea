const [signPath, attendancePath] = [
  '/wec-counselor-sign-apps/stu/sign',
  '/wec-counselor-attendance-apps/student/attendance',
] as const

export const CampusphereEndpoint = {
  sign: {
    tasksToday: `${signPath}/getStuSignInfosInOneDay`,
    tasksInMonth: `${signPath}/getStuSignInfosByWeekMonth`,
    taskDetails: `${signPath}/detailSignInstance`,
    submitSign: `${signPath}/submitSign`,
  },
  attendance: {
    tasksToday: `${attendancePath}/getStuAttendacesInOneDay`,
    tasksInMonth: `${attendancePath}/getStuSignInfosByWeekMonth`,
    taskDetails: `${attendancePath}/detailSignInstance`,
    submitSign: `${attendancePath}/submitSign`,
  },
} as const
