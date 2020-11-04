import React, { Fragment } from 'react'

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header.js";
import Empty from "components/Appointment/Empty.js";
import Show from "components/Appointment/Show.js";
import Form from "components/Appointment/Form.js";
import Confirm from "components/Appointment/Confirm.js";
import Status from "components/Appointment/Status.js";
import Error from "components/Appointment/Error.js";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import { useVisualMode } from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    props
      .bookInterview(props.id, interview, function () { transition(SHOW) }, function () { transition(ERROR_SAVE, true) });
  }

  function deleteApp() {
    transition(DELETING, true);
    props.deleteInterview(props.id, function () { transition(EMPTY) }, function () { transition(ERROR_DELETE, true) })
  }


  return (
    <article className="appointment" data-testid="appointment">
      <header>
        {props.time}
        {mode === EDIT && (
          <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save} />
        )}
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save} />
        )}
        {mode === SAVING && <Status message="Saving" />}
        {mode === DELETING && <Status message="Deleting" />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CONFIRM && <Confirm message="Are you sure you want to delete your interview appointment?" onCancel={() => back()} onConfirm={() => deleteApp()} />}
        {mode === ERROR_SAVE && <Error message = "Could not book appointment." onClose = {() => back()}/>}
        {mode === ERROR_DELETE && <Error message = "Could not cancel appointment." onClose= {() => back()}/>}
      </header>
    </article>
  )
}