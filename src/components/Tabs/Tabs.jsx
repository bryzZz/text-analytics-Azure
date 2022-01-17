import React, { useState } from 'react';

import './style.css';

export default function Tabs({ items }) {
    const [currentTab, setCurrentTab] = useState(1);

    const handleClick = (index) => {
        setCurrentTab(index);
    };

    return (
        <div className='Tabs'>
            <div className='titles'>
                {items.map(({ title }, index) => (
                    <button
                        className={
                            'Tabs__btn' +
                            (currentTab === index ? ' current' : '')
                        }
                        onClick={() => handleClick(index)}
                        key={index}
                    >
                        {title}
                    </button>
                ))}
            </div>
            <div className='Tabs__content'>{items[currentTab].data}</div>
        </div>
    );
}
