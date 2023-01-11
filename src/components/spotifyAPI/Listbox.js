import React from 'react';

const Listbox = props => {

    const clicked = e => {
        e.preventDefault();
        props.clicked(e.target.id);
    }    

    return (
        <div className="list-box" id='list_box'>
            <div className="list-group">
                {
                    props.items.map((item, idx) => 
                    <button key={idx}
                        onClick={clicked}
                        className="list-group-item list-group-item-action list-group-item-light"
                        id={item.track.id}>
                            
                            {item.track.name}
                    </button>)
                }
            </div>
        </div>


    );
}

export default Listbox;