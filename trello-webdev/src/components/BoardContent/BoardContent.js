import React, { useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'
import { initialData } from 'actions/initialData'
import { applyDrag } from 'utilities/dragDrop'

const BoardContent = () => {
    const [board, setBoard]=useState({})
    const [columns, setColumns]= useState({})

    useEffect( () => {
        const boardFromData= initialData.boards.find((board) => board.id==='board-1')
        if (boardFromData) {
            setBoard(boardFromData)
            setColumns(mapOrder(boardFromData.columns, boardFromData.columnOrder, 'id'))
        }
    }, [])
    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding':'10px', 'color':'white' }}>
            board not found
        </div>
    }
    const onColumnDrop=(dropResult) => {
        let newColumns=[...columns]
        newColumns= applyDrag(newColumns, dropResult)
        const newBoard=[...board]
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
                    < Column column={column} onCardDrop={onCardDrop}/>
                </Draggable>
            ))}
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon"/> Add another card
            </div>
        </div>
    )
}

export default BoardContent
