import React,{useEffect,useState} from 'react'
import{isEmpty} from 'lodash'

import './BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'ultilities/sort'
import { initalData } from 'actions/initalData'

const BoardContent = () => {
    const [board,setBoard]=useState({})
    const [columns,setColumns]=useState({})

    useEffect(()=>{
        const boardFromData=initalData.boards.find((board)=>board.id==='board-1')
        if(boardFromData){
            setBoard(boardFromData)
    
            setColumns(mapOrder(boardFromData.columns,boardFromData.columnOrder,'id'))
        }
    },[])
    if(isEmpty(board)){
        return <div className="not-found" style={{'padding':'10px','color':'white'}}>
            board not found
        </div>
    }

    return (
        <div className="board-content">
            {columns.map((column,index)=><Column key={index} column={column}/>)}
        
            </div>
    )
}

export default BoardContent
