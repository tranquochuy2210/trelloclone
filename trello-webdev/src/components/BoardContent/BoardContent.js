import React, { useEffect, useState, useRef} from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'
import { applyDrag } from 'utilities/dragDrop'
import { Col, Row, Container as BsContainer, Form, Button } from 'react-bootstrap'
import { fetchBoardDetails, createNewColumn, updateBoard, updateColumn, updateCard } from 'actions/ApiCall/index'
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
        fetchBoardDetails('6145f455502f754b4129e399').then((board) => {
            mapOrder(board.columns, board.columnOrder, '_id')
            setColumns(board.columns)
            setBoard(board)
        })
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
    const onColumnDrop= async (dropResult) => {
        let newColumns=[...columns]
        newColumns= applyDrag(newColumns, dropResult)
        const newBoard={ ...board }
        newBoard.columnOrder=newColumns.map( c => c._id)
        newBoard.columns=newColumns
        setColumns(newColumns)
        setBoard(newBoard)
        try {
            await updateBoard(newBoard._id, { columnOrder: newBoard.columnOrder })
        } catch (error) {
            setColumns(columns)
            setBoard(board)
            console.log(error)
        }
    }
    const onCardDrop = async (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            const newColumns=[...columns]
            let currentColumn =newColumns.find((c) => c._id===columnId)
            currentColumn.cards=applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map((i) => i._id)
            setColumns(newColumns)
            try {
                if ( dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
                    await updateColumn(currentColumn._id, { cardOrder: currentColumn.cardOrder })
                } else {
                    updateColumn(currentColumn._id, { cardOrder: currentColumn.cardOrder } )
                    if (dropResult.addedIndex !== null) {
                        const currentCard = { ...dropResult.payload }
                        currentCard.columnId = currentColumn._id
                        updateCard(currentCard._id, currentCard)
                    }
                }
            } catch (error) {
                setColumns(columns)
                console.log(error)
            }
            
            
        }
    }
    const addNewColumn= async() => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }

        const data={
            boardId: board._id,
            title: newColumnTitle.trim()
        }
        const newColumn = await createNewColumn(data)
        let newColumns=[...columns]
        newColumns.push(newColumn)
        const newBoard={ ...board }
        newBoard.columnOrder=newColumns.map( c => c._id)
        newBoard.columns=newColumns
        setColumns(newColumns)
        setBoard(newBoard)
        setNewColumnTitle('')
    }
    const onUpdateColumn= (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate._id
        let newColumns = [...columns]
        const columnIndex=newColumns.findIndex((column) => column._id===columnIdToUpdate)
        if (newColumnToUpdate._destroy) {
            newColumns.splice(columnIndex, 1)
        } else {
            newColumns.splice(columnIndex, 1, newColumnToUpdate)
        }
        const newBoard={ ...board }
        newBoard.columnOrder=newColumns.map( c => c._id)
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
                            <i className="fa fa-plus icon"/> Add another column
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
