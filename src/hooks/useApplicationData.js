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

  let dayId = undefined;
  for (const id in state.days) {
    if (state.days[id].name === state.day) {
      dayId = id;
    }
  }

  function bookInterview(id, interview, cb, errorcb) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        const days = state.days;
        days[dayId].spots -= 1;
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

  function deleteInterview(id, cb, errorcb) {
    axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(res => {
        const days = state.days;
        days[dayId].spots += 1;
        setState({
          ...state
        })
        cb();
      })
      .catch(err => {
        errorcb();
      });
  }
  return {state, setDay, bookInterview, deleteInterview};
}