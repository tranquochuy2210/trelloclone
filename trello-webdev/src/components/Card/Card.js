import React from 'react'
import PropTypes from 'prop-types'


const Card = props => {
    const {card}=props
    return (
        <li className="card-item">
            {card.cover&&<img src={card.cover} className="card-cover" alt="image"/>}
            Title:{card.title}
        </li>
    )
}

Card.propTypes = {

}

export default Card
