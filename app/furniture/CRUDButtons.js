const React = require('react');

const CRUDButtons = ({ onCreate, onUpdate, onDelete }) => {
  return (
    <div>
      <button onClick={onCreate}>Create</button>
      <button onClick={onUpdate}>Update</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default CRUDButtons;
