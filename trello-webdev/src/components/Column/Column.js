import React, { useCallback, useEffect, useState } from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sort'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM,  MODAL_ACTION_CLOSE} from 'utilities/constant'
import { selectAllInlineText, saveContentAfterPressEnter } from 'utilities/contentEditTable'

const Column = props => {
    const { column, onCardDrop, onUpdateColumn } =props
    const cards=column.cards
    mapOrder(cards, column.cardOrder, 'id')
    const [showConfirmModal, setShowConfirmModal]=useState(false)
    const toggleShowConfirmModal= () => setShowConfirmModal(!showConfirmModal)
    const [columnTitle, setColumnTitle]= useState('')

    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    const handleColumnChangeTitle= useCallback((e) => {
        setColumnTitle(e.target.value)
    }, [])
    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle
        }
        onUpdateColumn(newColumn)
    }

    const onConfirmModalAction= (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn)
        }
        toggleShowConfirmModal()
    }
    return (
        <div className="column">
            <header className="column-header">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        className="trello-content-edit-table"
                        spellCheck="false"
                        onClick={selectAllInlineText}
                        onChange={handleColumnChangeTitle}
                        value={columnTitle}
                        onKeyDown={saveContentAfterPressEnter}
                        onBlur={handleColumnTitleBlur}
                        onMouseDown={(e) => {e.preventDefault}}
                        // onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                    />
                </div>
                <div className="column-dropdown-actions">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn">
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu">
                        <Dropdown.Item className="dropdown-item">add Card</Dropdown.Item>
                        <Dropdown.Item className="dropdown-item" onClick={toggleShowConfirmModal}>remove column</Dropdown.Item>
                        <Dropdown.Item className="dropdown-item">move all card in this column</Dropdown.Item>
                        <Dropdown.Item className="dropdown-item"> all card in this column</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>
                </header>
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
                    onDrop={ dropResult => onCardDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]
                    }
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
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
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus"/> Add another card
                </div>
            </footer>
            <ConfirmModal
            title="Remove column"
            content={`Are you sure to remove ${column.title}. All related card will also be removed`}
            show={showConfirmModal}
            onAction={onConfirmModalAction}/>
        </div>
    )
}

Column.propTypes = {

}

export default Column
