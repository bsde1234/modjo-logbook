import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import FlashIcon from '@material-ui/icons/FlashOn';

import ColorButton from '../ColorButton';
import { sharedTooltipTouchConfig, hasTouch } from '../shared';
import { toggleColor, toggleSector } from '../../actions';
import { getSelection } from '../../selectors';
import colors from '../../models/colors';
import { getByValue as getFunRatingByValue } from '../../models/funRatings';
import { getByValue as getDifficultyRatingByValue } from '../../models/difficultyRatings';

const SendCell = (props) => {
  const {
    send,
    selectedColor,
    selectedSectors,
    classes,
    toggleColor,
    toggleSector,
  } = props;
  const { type, color, funRating, difficultyRating, sectorId } = send;
  const fun = getFunRatingByValue(funRating);
  const difficulty = getDifficultyRatingByValue(difficultyRating);

  return (
    <Fragment>
      { color && (
        <ColorButton
          variant={(selectedColor === color) ? 'raised' : 'flat'}
          size="small"
          color={color}
          onClick={() => toggleColor(color)}
        >
          {colors[color].label}
        </ColorButton>
      ) }

      { (type === 'clear') && (
        <Tooltip
          title="Secteur d&eacute;mont&eacute; / r&eacute;ouvert"
          {...sharedTooltipTouchConfig}
        >
          <RefreshIcon className={classes.clearIcon} />
        </Tooltip>
      ) }

      <span className={`${classes.group} ${hasTouch && 'hasTouch'}`}>
        <IconButton
          onClick={() => toggleSector(sectorId)}
          className={`${classes.sectorButton} ${selectedSectors.indexOf(sectorId) >= 0 && classes.sectorButtonSelected}`}
        >
          {sectorId}
        </IconButton>

        { (type === 'flash') && (
          <Tooltip
            title="Flash&eacute;"
            {...sharedTooltipTouchConfig}
          >
            <FlashIcon className={classes.typeIcon} />
          </Tooltip>
        ) }
      </span>

      <span className={classes.group}>
        { fun && (
          <Tooltip
            title={fun.description}
            {...sharedTooltipTouchConfig}
          >
            <span className={classes.emojiLabel}>
              { fun.emoji }
            </span>
          </Tooltip>
        ) }

        { difficulty && (
          <Tooltip
            title={difficulty.description}
            {...sharedTooltipTouchConfig}
          >
            <span className={classes.emojiLabel}>
              { difficulty.emoji }
            </span>
          </Tooltip>
        ) }
      </span>
    </Fragment>
  );
};

const margin = '6px';

const styles = {
  sectorButton: {
    height: '28px',
    width: '28px',
    marginRight: margin,
    fontSize: '18px',
    '.hasTouch &:hover': {
      backgroundColor: 'initial',
    },
  },

  sectorButtonSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    '.hasTouch &:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },

  typeIcon: {
    verticalAlign: 'middle',
    marginRight: margin,
  },

  clearIcon: {
    verticalAlign: 'middle',
    // to align with the color buttons
    width: '68px',
    marginTop: margin,
    marginBottom: margin,
  },

  group: {
    whiteSpace: 'nowrap',
    '@media (max-width: 600px)': {
      display: 'block',
    },
  },

  emojiLabel: {
    fontSize: '1.5rem',
    display: 'inline-flex',
    flex: '0 0 auto',
    verticalAlign: 'middle',
    cursor: 'default',
    margin,
  },
};

const StyledSendCell = withStyles(styles)(SendCell);

const mapStateToProps = (state) => {
  const { color, sectorIds } = getSelection(state);
  return {
    selectedColor: color,
    selectedSectors: sectorIds,
  };
};

const mapDispatchToProps = { toggleColor, toggleSector };

const ConnectedSendCell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledSendCell);

export default ConnectedSendCell;
