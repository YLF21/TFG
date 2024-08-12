import React, { Component } from 'react'
import axios from 'axios'
import Schedule from '../Schedule'
import Notification from '../Notification'

export default class ScheduleList extends Component {
  state = {
    schedules: [],
    notification: {
      show: false,
      message: '',
      color: '',
      router:'',
      autoDismiss: false
    },
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`/schedule/${this.props.subject._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.setState({ schedules: response.data.data });
    } catch (error) {
      console.error('Error fetching schedules:', error)
    }
  }

  handleDelete = async (scheduleId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`/schedule/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      const newNotification = {
        show: true,
        message: data.msg,
        color: data.code === '0000' ? 'success' : 'error',
        router: data.code === '0000' ? '' : '',
        autoDismiss: data.code === '0000'
      }

      this.setState({
        notification: newNotification, schedules: this.state.schedules.filter(schedule => schedule._id !== scheduleId)
      });

      if(data.code==='0000'){
        window.location.reload()
      }

    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  };

  render() {
    const { schedules, notification } = this.state;
    return (
      <div>
        <h2>My Schedule</h2>
        {notification.show && <Notification message={notification.message} color={notification.color} autoDismiss={notification.autoDismiss} router={notification.router}/>}
        <div className="times-container">
          {schedules.map(schedule => (
            <Schedule key={schedule._id} {...schedule} onDelete={this.handleDelete} />
          ))}
        </div>
      </div>
    );
  }
}
