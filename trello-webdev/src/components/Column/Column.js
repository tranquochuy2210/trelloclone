import React from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sort'
import { Container, Draggable } from 'react-smooth-dnd'

const Column = props => {
    const { column } =props
    const cards=column.cards
    mapOrder(cards, column.cardOrder, 'id')
    const onCardDrop = (dropResult) => {
        console.log(dropResult)
    }
    return (
        <div className="column">
            <header className="column-header">{column.title}</header>
                <div className="card-list">
                    <Container
                    {...column.props}
                    groupName= "trello-columns"
                    // onDragEnter={() => {
                    //     console.log( 'drag enter:', column.id)
                    //   }}
                    //   onDragLeave={() => {
                    //     console.log('drag leave:', column.id)
                    //   }}
                    // onDragStart={e => console.log('drag started', e)}
                    // onDragEnd={e => console.log('drag end', e)}
                    onDrop={onCardDrop()}
                    getChildPayload={index => cards[index]
                    }
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    onDropReady={p => console.log (p)}
                    dropPlaceholder={{
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                    >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            < Card card={card}/>
                        </Draggable>
                    ))}
                    </Container>
                </div>
          <footer>Add another card</footer>
        </div>
    )
}

Column.propTypes = {

}

export default Column
