import React from 'react'
import './Card.scss'


const Card = props => {
    const { card }=props
    return (
        <div className="card-item">
            {card.cover&&<img src={card.cover} className="card-cover" alt="image" onMouseDown={e => e.preventDefault()}/>}
            Title:{card.title}
        </div>
    )
}

Card.propTypes = {

}

export default Card
