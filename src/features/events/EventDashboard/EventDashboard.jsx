import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { createEvent, deleteEvent, updateEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';

const mapState = (state) => ({
  events: state.firestore.ordered.events
});

const actions = {
  createEvent,
  deleteEvent,
  updateEvent,
};

class EventsDashboard extends Component {
  handleDeleteEvent = (id) => {
    this.props.deleteEvent(id);
  };

  render() {
    const { events } = this.props;
    if (!isLoaded(events)) return <LoadingComponent />;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} deleteEvent={this.handleDeleteEvent} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    );
  }
}

// export default connect(mapState, actions)(EventsDashboard);
export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: 'events' }])(EventsDashboard));