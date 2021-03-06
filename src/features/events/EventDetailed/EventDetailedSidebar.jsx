import React from 'react';
import { Segment, Item, Label, List, Sticky } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const EventDetailedSidebar = ({ attendees, contextRef }) => {
  return (
    <Sticky context={contextRef} offset={78} styleElement={{ zIndex: 0 }}>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees && attendees.length}{' '}
        {attendees && attendees.length === 1 ? 'Person' : 'People'} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees &&
            attendees.map((attendee) => (
              <Item.Group divided key={attendee.id}>
                <Item key={attendee.id} style={{ position: 'relative' }}>
                  {attendee.host && (
                    <Label
                      style={{ position: 'absolute' }}
                      color='orange'
                      ribbon='right'
                    >
                      Host
                    </Label>
                  )}
                  <Item.Image
                    size='tiny'
                    src={attendee.photoURL || '/assets/user.png'}
                  />
                  <Item.Content verticalAlign='middle'>
                    <Item.Header as='h3'>
                      <Link to={`/profile/${attendee.id}`}>
                        {attendee.displayName}
                      </Link>
                    </Item.Header>
                  </Item.Content>
                </Item>
              </Item.Group>
            ))}
        </List>
      </Segment>
    </Sticky>
  );
};

export default EventDetailedSidebar;
