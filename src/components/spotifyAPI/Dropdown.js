import React from 'react';

const Dropdown = props => {    

    const dropdownChanged = e => {
        props.changed(e.target.value);

    }    

    return (
        <div className="drop-down">
            <label className="form-label">{props.label}</label>       
            <select value={props.selectesdValue} onChange={dropdownChanged} className="form-control">
                <option key={0}>Select...</option>
                {props.options.map((item, idx) => <option key={idx + 1} value={item.id}>{item.name}</option>)}
            </select>
        </div>
    );
}

export default Dropdown;