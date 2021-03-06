import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Item, Button, Icon, Label, Popup } from 'semantic-ui-react';
import ScreamDetailsCarousel from './../ScreamDetails/ScreamDetailsCarousel';
// import MyButton from '../../../app/common/util/MyButton';

const ScreamDetailedInfo = ({ scream, isHost }) => {
  return (
    <Fragment>
      <Segment attached style={{ padding: 0 }}>
        <Item.Group>
          <Item>
            <ScreamDetailsCarousel scream={scream} />
          </Item>
        </Item.Group>
      </Segment>
      <Segment attached>
        <Item.Group>
          <Item>
            <span style={{ whiteSpace: 'pre-wrap' }}>{scream.body}</span>
          </Item>
        </Item.Group>
      </Segment>
      <Segment attached='bottom' clearing>
        <Popup
          content='Like'
          trigger={
            <Button as='div' labelPosition='right'>
              <Button icon>
                <Icon name='heart' />
              </Button>
              <Label as='a' basic pointing='left'>
                24
              </Label>
            </Button>
          }
        />

        {isHost && (
          <Popup
            content='Manage'
            trigger={
              <Button
                floated='right'
                icon
                as={Link}
                to={`/manageScream/${scream.id}`}
              >
                <Icon name='edit' />
              </Button>
            }
          />
        )}
      </Segment>
    </Fragment>
  );
};

export default connect()(ScreamDetailedInfo);
