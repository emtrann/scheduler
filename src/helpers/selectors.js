export { getAppointmentsForDay, getInterviewersForDay, getInterview };
//returns list of appointments for day selected 
function getAppointmentsForDay(state, day) {
  let appointmentArray = [];
  for (const appDay of state.days) {
    if (appDay.name === day) {
      for (const appointment of appDay.appointments) {
        appointmentArray.push(state.appointments[appointment])
      }
    }
  }
  return appointmentArray;
}
// returns interviewers for selected interview time 
function getInterviewersForDay(state, day) {
  let interviewersArray = [];
  for (const element of state.days) {
    if (element.name === day && Array.isArray(element.interviewers)) {
      for (const appointment of element.interviewers) {
        interviewersArray.push(state.interviewers[appointment]);
      }
    }
  }
  return interviewersArray;
}

// gets interview info
function getInterview(state, interview) {
  if (!interview) {
    return null;
  } else {
    for (const person in state.interviewers) {
      if (person == interview.interviewer) {
        return {student: interview.student, interviewer: state.interviewers[person]}
      }
    }
  }
}

