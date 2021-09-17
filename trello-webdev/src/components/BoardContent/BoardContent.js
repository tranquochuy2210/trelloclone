import React, { useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sort'
import { initialData } from 'actions/initialData'

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
        console.log(dropResult)
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
                    < Column column={column}/>
                </Draggable>
            ))}
            </Container>
        </div>
    )
}

export default BoardContent
