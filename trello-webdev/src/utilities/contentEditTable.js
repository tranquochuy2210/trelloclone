
export const selectAllInlineText = (e) => {
    e.target.select()
}
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.target.blur()
    }
}