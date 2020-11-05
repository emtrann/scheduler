import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: []
  });

  const setDay = day => setState({ ...state, day });
  // gets data from api 
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((all) => {
        setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
      })
  }, []);

  // function to update spots available when interview booked/deleted
  let dayId = undefined;
  for (const id in state.days) {
    if (state.days[id].name === state.day) {
      dayId = id;
    }
  }

  // function to book interview 
  function bookInterview(id, interview, cb, errorcb) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log('hello', state.appointments[id].interview)
    // updates database + decreases available interview spots
    axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        const days = state.days;
        if (state.appointments[id].interview === null) {
          days[dayId].spots -= 1;
        }
        setState({
          ...state,
          appointments
        });
        cb();
      })
      .catch(err => {
        errorcb();
      });
  }
  // delete interview func - updates database + increases available interview spots
  function deleteInterview(id, cb, errorcb) {

    axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        const appointment = {
          ...state.appointments[id],
          interview: null
        };
    
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
        const days = state.days;
        days[dayId].spots += 1;
        setState({
          ...state,
          appointments
        })
        cb();
      })
      .catch(err => {
        errorcb();
      });
  }
  return {state, setDay, bookInterview, deleteInterview};
}