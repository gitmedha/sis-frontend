import {useState} from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import CreateEventForm from './CreateEventForm';

const localizer = momentLocalizer(moment)


const EventCalendar = (props) => {

  const [createEventForm,setCreateEventForm] = useState(false);

  const showCreateEventForm = async()=>{
    console.log("show")
    setCreateEventForm(true);

  }

  const hideCreateEventForm = async()=>{
    console.log("hide")
    setCreateEventForm(false);
  }

  const myEventsList = [
    {
      title: 'Meeting with Client',
      start: new Date('2024-02-09T10:00:00'),
      end: new Date('2024-02-10T12:00:00')
    },
    {
      title: 'Lunch Break',
      start: new Date('2024-02-09T12:30:00'),
      end: new Date('2024-02-09T13:30:00'),
    },
    // Add more events as needed
  ];

  return (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      selectable
      style={{ height: 500 ,width:'90%'}}
      onSelectSlot={(slotInfo) => showCreateEventForm()}
      onSelectEvent={(event, e) => console.log("ff",event)}
    />
    {
      createEventForm && <CreateEventForm onHide={hideCreateEventForm}/>
    }
  </div>
)}

export default EventCalendar;