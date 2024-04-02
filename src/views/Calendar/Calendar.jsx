import {useState,useEffect} from 'react';
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import EventForm from './calendarComponents/EventForm';
import ViewEvent from './calendarComponents/ViewEvent';
import {getEvents} from './calendarComponents/calendarActions';
import NP from "nprogress";

const localizer = momentLocalizer(moment)

const EventCalendar = (props) => {

  const [eventData,setEventData] = useState({
    assgined_to:"",
    alumni_service:"",
    start_date:"",
    end_date:'',
    status:''
  })

  const [eventList,setEventList] = useState([{
    title: '',
    start: '',
    end: '',
    assgined_to:'',
    event_status:''
  }])

  
  const [createEventForm,setCreateEventForm] = useState(false);
  const [viewEventModal,setViewEventModal] = useState(false);
  const [slotInfo,setSlotInfo] = useState('')
  const [currentView,setCurrentView] = useState('month');


  const formateResponseToEventList = async (response) =>{

    const formattedEvents = response.map(event => ({
      title: event.name,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      assigned_to: event.assgined_to.username,
      event_status: event.status
    }));

    setEventList(formattedEvents);
  }

  useEffect(()=>{
    async function populateEvents(){
      NP.start()
     const response =  await getEvents();
     await formateResponseToEventList(response)
     NP.done();
    }
    
    populateEvents();

  },[])

  const fetchEventsAgain = async () => {
    NP.start();
    const response = await getEvents();
    await formateResponseToEventList(response);
    NP.done();
  };
  

  const showCreateEventForm = async(info)=>{
    await setSlotInfo(info);
    setCreateEventForm(true);
  }

  const hideCreateEventForm = async()=>{
    setCreateEventForm(false);
  }

  const hideViewEventModal = async()=>{
    setViewEventModal(false);
  }

  const openViewEventModal = async(eventInfo)=>{
   await setEventData({
      assgined_to:eventInfo.assigned_to,
      start_date:eventInfo.start,
      end_date:eventInfo.end,
      alumni_service:eventInfo.title,
      status:eventInfo.event_status
    })
    setViewEventModal(true);
  }

  const eventStyleGetter = (event) => {
    let backgroundColor = '#ced4da'; // Default color (grey)
    if (event.event_status === 'Open') {
      backgroundColor = '#257b69'; // Green for open events
    }
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  

  return (
  <div>
    <Calendar
      localizer={localizer}
      events={eventList}
      startAccessor="start"
      endAccessor="end"
      selectable
      style={{ height: 600 ,width:'97%'}}
      onView={handleViewChange}
      onSelectSlot={(slotInfo) => {
        if (currentView === 'month') {
          showCreateEventForm(slotInfo);
        }
      }}
      onSelectEvent={(event) =>openViewEventModal(event)}
      eventPropGetter={eventStyleGetter}
      views={['month', 'week', 'day']}
    />
    {
      createEventForm && <EventForm onHide={hideCreateEventForm} onEventCreated={fetchEventsAgain} slotInfo={slotInfo}/>
    }
    {
      viewEventModal && <ViewEvent onHide={hideViewEventModal} event={eventData}/>
    }

  </div>
)}

export default EventCalendar;