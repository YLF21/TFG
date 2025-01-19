import React, { Component} from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios'; 
import './index.css';

export default class ClassroomTimetable extends Component {

  state = {
    timetableData: [],
    loading: true, 
    classroomName: '',
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`http://localhost:3001/timetable/classroom/${this.props.id}`, {  
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.data && response.data.data.length > 0) {
        const classroomName = response.data.data[0].classroom.classroomName; 
        this.setState({ 
          timetableData: response.data.data, 
          classroomName,  
          loading: false 
        });  
      } else {
          this.setState({ loading: false });
        }
    } catch (error) {
      console.error('Error fetching classroom info:', error);
      this.setState({ loading: false }); 
    }
  }
  
  


  isHourOccupied(dayOfWeek,hour){
    const {timetableData} = this.state;
    if (!Array.isArray(timetableData)) return false;
    for (const entry of timetableData){
      if(entry.dayOfWeek === dayOfWeek) {
        const startHour = new Date(entry.startTime).getHours();
        const endHour = new Date(entry.endTime).getHours();
        if (hour >= startHour && hour < endHour) {
          return entry.subject.acronym; 
        }
      }
    }
    return false; 
  }
  





  render() {
    const hours = [];
    const dayOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const startTime = 9;
    const endTime = 21;
    const rows = 13; 
    const { timetableData, loading, classroomName } = this.state;
   

    if (loading) {
      return (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      );
    }

    for (let i = startTime; i <= endTime; i++) {
      hours.push(`${i}:00`);
    }


    const table = [];
    const firstRow = [<th key="hour">Hora</th>];
    for (let i = 0; i < dayOfWeek.length; i++) {
      firstRow.push(<th key={dayOfWeek[i]}>{dayOfWeek[i]}</th>);
    }
    table.push(<tr key="day">{firstRow}</tr>);
    
    for (let i = 0; i < rows-1; i++) {
      const row = [];
      row.push(<td key={`hour-${i}`}>{hours[i]} - {hours[i+1]} </td>);
      
      for (let j = 0; j < dayOfWeek.length; j++) {
        const isOccupied = this.isHourOccupied(j + 1 , startTime + i); 
        row.push(
          <td key={`${dayOfWeek[j]}-${i}`} style={{ backgroundColor: isOccupied ? 'yellow' : 'white' }}>
            {isOccupied ? this.isHourOccupied(j + 1, startTime + i) : ''}
          </td>
        );
      }
      
      table.push(<tr key={`row-${i}`}>{row}</tr>);
    }


    if (timetableData) {
    return (
      <div>
        <div className= 'Title'>
          <h1>Horario del aula {classroomName}</h1>
        </div>
        <div className="table-container">
          <table border="1">
            <tbody>
              {table}
            </tbody>
          </table>
        </div>
      </div>
    );
    }else {
      return (
        <div className="mt-5 text-center">
          <p>No se pudo obtener la información de la clase.</p>
        </div>
      );
    }
  }
}
