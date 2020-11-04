export { getAppointmentsForDay, getInterviewersForDay, getInterview };

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

function getInterviewersForDay(state, day) {
  let interviewersArray = [];
  for (const element of state.days) {
    if (element.name === day) {
      for (const appointment of element.appointments) {
        if (state.appointments[appointment].interview !== null && !interviewersArray.includes(state.interviewers[state.appointments[appointment].interview.interviewer])) {
          interviewersArray.push(state.interviewers[state.appointments[appointment].interview.interviewer])
        }
      }
    }
  }
  return interviewersArray;
}

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

