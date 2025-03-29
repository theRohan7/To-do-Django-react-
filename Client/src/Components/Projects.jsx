import { ListFilterPlus } from 'lucide-react'
import React from 'react'
import '../CSS/Project.css'


const taskSection = [
    {
        title: 'To Do',
        totalTasks: 0 ,
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
                    <button className='add-task-btn'>+</button>
                    <div className="task-list">
                        list tasks
                    </div>
                </div>

            ))

            }
        </div>
      
    </div>
  )
}

export default Projects
