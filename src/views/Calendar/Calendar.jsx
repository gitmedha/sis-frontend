import {useState} from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import CreateEventForm from './calendarComponents/CreateEventForm';
import ViewEvent from './calendarComponents/ViewEvent';

const localizer = momentLocalizer(moment)


const EventCalendar = (props) => {

  const [createEventForm,setCreateEventForm] = useState(false);
  const [viewEventModal,setViewEventModal] = useState(false);
  const [eventData,setEventData] = useState({
    assgined_to:"",
    alumni_service:"",
    start_date:"",
    end_date:'',
    status:''
  })

  const showCreateEventForm = async(slotInfo)=>{
    setCreateEventForm(true);

  }

  const hideCreateEventForm = async()=>{
    setCreateEventForm(false);
  }

  const hideViewEventModal = async()=>{
    setViewEventModal(false);
  }

  const openViewEventModal = async(eventInfo)=>{
    console.log("eventInfo:",eventInfo)
   await setEventData({
      assgined_to:"Deepak",
      start_date:eventInfo.start,
      end_date:eventInfo.end,
      alumni_service:eventInfo.title,
      status:eventInfo.event_status
    })
    setViewEventModal(true);
  }
  const myEventsList = [
    {
      title: 'Meeting with Client',
      start: new Date('2024-03-09T10:00:00'),
      end: new Date('2024-03-10T12:00:00'),
      assgined_to:'Deepak Sharma',
      event_status:'open'
    },
    {
      title: 'Lunch Break',
      start: new Date('2024-03-09T12:30:00'),
      end: new Date('2024-03-09T13:30:00'),
    }
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
      onSelectSlot={(slotInfo) => showCreateEventForm(slotInfo)}
      onSelectEvent={(event) =>openViewEventModal(event)}
    />
    {
      createEventForm && <CreateEventForm onHide={hideCreateEventForm}/>
    }
    {
      viewEventModal && <ViewEvent onHide={hideViewEventModal} event={eventData}/>
    }
  </div>
)}

export default EventCalendar;