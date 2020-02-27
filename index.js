class EventsSelector {
  constructor(normalEvents, unusualEvents, probabilityOfUnusualEvents = 25) {
    this.normalEvents = normalEvents;
    this.unusualEvents = unusualEvents;
    this.probabilityOfUnusualEvents = probabilityOfUnusualEvents;

    this.occurredEvents = [];
  }

  _getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  _generateProbability(events) {
    return events.reduce((res, current) => {
      if (current.probability) {
        const probabilities = [];
        for (let i = 0; i < current.probability; i++) {
          probabilities[i] = { ...current, probability: undefined };
        }
        return [...res, ...probabilities];
      }
      return [...res, current];
    }, []);
  }

  _selectEvent() {
    let events = [];

    events = this.normalEvents;

    if (this._getRandom(100) <= this.probabilityOfUnusualEvents) {
      events = this.unusualEvents;
    }

    events = this._generateProbability(events);

    const selectedEventIndex = this._getRandom(events.length);
    return events[selectedEventIndex];
  }

  _findEventInList(eventList, eventToFind) {
    return eventList.filter(event => event.name === eventToFind.name)[0];
  }

  _removeEventFromList(eventList, eventToRemove) {
    return eventList.filter(event => event.name !== eventToRemove.name);
  }

  addNormalEvents(newEvents) {
    this.normalEvents = [...this.normalEvents, ...newEvents];
  }

  addUnusualEvents(newEvents) {
    this.unusualEvents = [...this.unusualEvents, ...newEvents];
  }

  setProbabilityOfUnusualEvents(probabilityOfUnusualEvents) {
    this.probabilityOfUnusualEvents = probabilityOfUnusualEvents;
  }

  cleanOccurredEvents() {
    this.occurredEvents = [];
  }

  reset() {
    this.normalEvents = [];
    this.unusualEvents = [];
    this.occurredEvents = [];
    this.probabilityOfUnusualEvents = 25;
  }

  processEvent() {
    const selectedEvent = this._selectEvent();

    if ("maximumOccurrences" in selectedEvent) {
      const currentEvent = this._findEventInList(
        this.occurredEvents,
        selectedEvent
      );

      if (currentEvent) {
        if (currentEvent.maximumOccurrences > 0) {
          currentEvent = {
            ...currentEvent,
            maximumOccurrences: currentEvent.maximumOccurrences - 1
          };

          this.occurredEvents = this._removeEventFromList(
            this.occurredEvents,
            currentEvent
          );

          this.occurredEvents.push(currentEvent);

          return [currentEvent, this.occurredEvents];
        }

        return this.processEvent(this.occurredEvents);
      } else {
        if (selectedEvent.maximumOccurrences <= 0) {
          return this.processEvent(this.occurredEvents);
        }

        selectedEvent = {
          ...selectedEvent,
          maximumOccurrences: selectedEvent.maximumOccurrences - 1
        };
      }
    }

    this.occurredEvents.push(selectedEvent);
    return [selectedEvent, this.occurredEvents];
  }
}

export default EventsSelector;
