import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import SubjectList from '../../components/SubjectList'

export default class Classroom extends Component {
    render() {
        return (
            <div>
                <SubjectList />
                <div className="fixed-bottom text-center mb-3">
                    <NavLink className="btn btn-primary button_nav" to="/subject/createSubject">
                        Create Subject
                    </NavLink>
                </div>
            </div>
        )
    }
}
