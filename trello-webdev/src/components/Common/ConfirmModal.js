import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { MODAL_ACTION_CONFIRM,  MODAL_ACTION_CLOSE} from 'utilities/constant'

function ConfirmModal(props) {
    const { title, content, show, onAction }=props
    return (
      <div>
        <Modal
        show={show}
        onHide={ () => onAction('close')}
        backdrop="static"
        keyboard={false}
        animation={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() =>onAction(MODAL_ACTION_CLOSE)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
export default ConfirmModal
