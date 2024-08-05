import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  return (
    <div style={{ height: "500px", marginTop: "200px" }}>
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        view={["month"]}
        style={{ height: "500px", marginLeft: "14px", width: "93%", backgroundColor:"white" }}
      />
    </div>
  );
};

export default MyCalendar;
