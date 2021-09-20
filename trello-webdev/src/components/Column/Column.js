import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Column.scss'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sort'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constant'
import { selectAllInlineText, saveContentAfterPressEnter } from 'utilities/contentEditTable'
import { cloneDeep } from 'lodash'
import { createNewCard, updateColumn } from 'actions/ApiCall/index'

const Column = props => {
    const { column, onCardDrop, onUpdateColumn } =props
    const cards=column.cards
    mapOrder(cards, column.cardOrder, '_id')
    const [showConfirmModal, setShowConfirmModal]=useState(false)
    const toggleShowConfirmModal= () => setShowConfirmModal(!showConfirmModal)
    const [columnTitle, setColumnTitle]= useState('')

    const [openNewCardForm, setOpenNewCardForm]= useState(false)
    const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

    const newCardTextAreaRef=useRef(null)

    const [newCardTitle, setNewCardTitle]=useState('')
    const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

    const addNewCard= async () => {
        if (!newCardTitle) {
            newCardTextAreaRef.current.focus()
            return
        }
        const data={
            boardId: column.boardId,
            columnId: column._id,
            title: newCardTitle.trim()
        }
        const newCard = await createNewCard(data)
        const newColumn= cloneDeep(column)
        newColumn.cards.push(newCard)
        newColumn.cardOrder.push(newCard._id)
        onUpdateColumn(newColumn)
        setNewCardTitle('')
        toggleOpenNewCardForm()
    }
    useEffect(() => {
        setColumnTitle(column.title)
    }, [column.title])

    useEffect( () => {
        if (newCardTextAreaRef && newCardTextAreaRef.current) {
            newCardTextAreaRef.current.focus()
            newCardTextAreaRef.current.select()
        }
    }, [openNewCardForm])

    const handleColumnChangeTitle= useCallback((e) => {
        setColumnTitle(e.target.value)
    }, [])
    const handleColumnTitleBlur = async() => {
        if (column.title !== columnTitle) {
            const newColumn= await updateColumn(column._id, { title: columnTitle })
            onUpdateColumn(newColumn)
        }
    }

    const onConfirmModalAction= async (type) => {
        if (type === MODAL_ACTION_CONFIRM) {
            const newColumn = await updateColumn(column._id, { _destroy: true })
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
                        <Dropdown.Item className="dropdown-item" onClick={toggleOpenNewCardForm}>add Card</Dropdown.Item>
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
                    onDrop={ dropResult => onCardDrop(column._id, dropResult)}
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
                {openNewCardForm&&
                    <div className="add-card-area">
                        <Form.Control
                            size="sm"
                            as="textarea"
                            placeholder="Enter title of this card "
                            className="input-enter-new-card"
                            ref={newCardTextAreaRef}
                            onChange={onNewCardTitleChange}
                            value={newCardTitle}
                            onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                        />
                    </div>
                }
            </div>
            <footer>
                {openNewCardForm&&
                    <div>
                        <Button variant="success" type="submit" size="sm" onClick={addNewCard}>
                            Add card
                        </Button>
                        <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                            <i className="fa fa-trash icon" />
                        </span>
                    </div>
                }
                {!openNewCardForm&&
                <div className="footer-actions" onClick={toggleOpenNewCardForm}>
                    <i className="fa fa-plus"/> Add another card
                </div>
                }
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
