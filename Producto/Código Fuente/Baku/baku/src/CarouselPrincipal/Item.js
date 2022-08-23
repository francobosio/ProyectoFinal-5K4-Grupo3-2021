import React from 'react';
import cx from 'classnames';
import SliderContext from './context'
import ShowDetailsButton from './ShowDetailsButton'
import Mark from './Mark'
import './Item.scss'

const Item = ({ movie }) => (
  <SliderContext.Consumer>
    {({ onSelectSlide, currentSlide, elementRef }) => {
      const isActive = false;
      let incremento = 0;
      return (
        <div
          ref={elementRef}
          className={cx('item', {
            'item--open': true,
          })}
        >
          {incremento=incremento+1}
          <h1 className='numero' onClick={() => onSelectSlide(movie)}>1</h1>
          <img src={movie.imagenPath} alt="" onClick={() => onSelectSlide(movie)} ></img>
          {isActive && <Mark />}
        </div>
      );
    }}
  </SliderContext.Consumer>
);

export default Item;
