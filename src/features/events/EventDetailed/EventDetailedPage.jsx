import React, { Component, createRef } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import {
  objectToArray,
  createDataTree,
} from '../../../app/common/util/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';
import { addEventComment } from '../eventActions';
import { openModal } from '../../modals/modalActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import NotFound from '../../../app/layout/NotFound';

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(
        (event) => event.id === eventId
      )[0] || {};
  }

  return {
    event,
    requesting: state.firestore.status.requesting,
    loading: state.async.loading,
    auth: state.firebase.auth,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) && // If Chat is not empty
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id]),
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal,
};

class EventDetailedPage extends Component {
  contextRef = createRef();

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const {
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      eventChat,
      loading,
      openModal,
      requesting,
      match,
    } = this.props;
    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort((a, b) => {
        return a.joinDate.toDate() - b.joinDate.toDate();
      });
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some((a) => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const authenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent) return <LoadingComponent />;
    if (Object.keys(event).length === 0) return <NotFound />;

    return (
      <Grid>
        <Grid.Column width={10}>
          <div ref={this.contextRef}>
            <EventDetailedHeader
              event={event}
              isHost={isHost}
              isGoing={isGoing}
              goingToEvent={goingToEvent}
              cancelGoingToEvent={cancelGoingToEvent}
              loading={loading}
              authenticated={authenticated}
              openModal={openModal}
            />
            <EventDetailedInfo event={event} />
            {authenticated && (
              <EventDetailedChat
                addEventComment={addEventComment}
                eventId={event.id}
                eventChat={chatTree}
              />
            )}
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar
            contextRef={this.contextRef}
            attendees={attendees}
            eventId={event.id}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect((props) => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
