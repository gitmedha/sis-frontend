import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)


const EventCalendar = (props) => {

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
      onSelectSlot={(slotInfo) => console.log("sf",slotInfo)}
      onSelectEvent={(event, e) => console.log("ff",event)}
    />
  </div>
)}

export default EventCalendar;