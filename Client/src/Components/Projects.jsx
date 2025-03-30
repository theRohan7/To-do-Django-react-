import { ListFilterPlus } from 'lucide-react'
import React, { useState } from 'react'
import '../CSS/Project.css'
import CreateTaskForm from './CreateTaskForm'


const taskSection = [
    {
        title: 'To Do',
        totalTasks: 0  ,
        tasks: []
    },
    {
        title: 'In Progress',
        totalTasks: 0 ,
        tasks: []
    },
    {
        title: 'Completed',
        totalTasks: 0 ,
        tasks: []
    },
]


function Projects() {

    const [taskForm , setTaskFrom] = useState(false)

    const openTaskForm = () => {
        setTaskFrom(true)   
    }
    
    const closeTaskForm = () => {
        setTaskFrom(false)   
    }
    

  return (
    <div className='project-main'>
        <div className='project-header'>
            <h1>Projects</h1>
            <button><ListFilterPlus /> Filter</button>
        </div>
        <div className="tasks-section">
            {taskSection.map((section, idx) => (
                <div key={idx} className="task-section">
                    <div className="section-header">
                        <h2>{section.title}</h2>
                        <p>{section.totalTasks}</p>
                    </div>
                    <button className='add-task-btn' onClick={openTaskForm}  >+</button>
                    <div className="task-list">
                        list tasks
                    </div>
                </div>

            ))

            }
        </div>
        {taskForm && <CreateTaskForm  onClose={closeTaskForm} />}
    </div>
  )
}

export default Projects
