import React, { useEffect, useState, useRef} from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'
import { initialData } from 'actions/initialData'
import { applyDrag } from 'utilities/dragDrop'
import { Col, Row, Container as BsContainer, Form, Button } from 'react-bootstrap'

const BoardContent = () => {
    const [board, setBoard]=useState({})
    const [columns, setColumns]= useState({})
    const [openNewColumnForm, setOpenNewColumnForm]= useState(false)
    const newColumnInputRef=useRef(null)
    const [newColumnTitle, setNewColumnTitle]=useState('')
    const onNewColumnTitleChange=(e) => {
            setNewColumnTitle(e.target.value)
    }
    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
    useEffect( () => {
        const boardFromData= initialData.boards.find((board) => board.id==='board-1')
        if (boardFromData) {
            setBoard(boardFromData)
            setColumns(mapOrder(boardFromData.columns, boardFromData.columnOrder, 'id'))
        }
    }, [])
    useEffect( () => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus()
            newColumnInputRef.current.select()
        }
    }, [openNewColumnForm])
    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding':'10px', 'color':'white' }}>
            board not found
        </div>
    }
    const onColumnDrop=(dropResult) => {
        let newColumns=[...columns]
        newColumns= applyDrag(newColumns, dropResult)
        const newBoard={...board}
        newBoard.columnOrder=newColumns.map( c => c.id)
        newBoard.columns=newColumns
        setColumns(newColumns)
        setBoard(newBoard)
    }
    const onCardDrop = (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            const newColumns=[...columns]
            let currentColumn =newColumns.find((c) => c.id===columnId)
            currentColumn.cards=applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map((i) => i.id)
            setColumns(newColumns)
            console.log(columnId)
            console.log(currentColumn)
        }
    }
    const addNewColumn= () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }
        const newColumnToAdd={
            id: Math.random().toString(36).substr(2, 5),
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }
        let newColumns=[...columns]
        newColumns.push(newColumnToAdd)
        const newBoard={...board}
        newBoard.columnOrder=newColumns.map( c => c.id)
        newBoard.columns=newColumns
        setColumns(newColumns)
        setBoard(newBoard)
        setNewColumnTitle('')
    }
    const onUpdateColumn= (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate.id
        let newColumns = [...columns]
        const columnIndex=newColumns.findIndex((column) => column.id===columnIdToUpdate)
        if (newColumnToUpdate._destroy) {
            newColumns.splice(columnIndex, 1)
        } else {
            newColumns.splice(columnIndex, 1, newColumnToUpdate)
        }
        const newBoard={ ...board }
        newBoard.columnOrder=newColumns.map( c => c.id)
        newBoard.columns=newColumns
        setColumns(newColumns)
        setBoard(newBoard)
    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-header"
                dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: 'columns-drop-preview'
                }}
            >
            {columns.map((column, index) => (
                <Draggable key={index}>
                    < Column column={column} onCardDrop={onCardDrop} onUpdateColumn = {onUpdateColumn}/>
                </Draggable>
            ))}
            </Container>
            <BsContainer>
                {!openNewColumnForm&&
                    <Row className="add-new-column">
                        <Col onClick={toggleOpenNewColumnForm}>
                            <i className="fa fa-plus icon"/> Add another card
                        </Col>
                    </Row>
                }
                {
                    openNewColumnForm&&
                    <Row >
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title.."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                onChange={onNewColumnTitleChange}
                                value={newColumnTitle}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="success" type="submit" size="sm" onClick={addNewColumn}>
                                Add column
                            </Button>
                            <span className="cancel-icon"><i className="fa fa-trash icon" onClick={toggleOpenNewColumnForm}/></span>
                        </Col>
                    </Row>
                }
            </BsContainer>
        </div>
    )
}

export default BoardContent
