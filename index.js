const Chance = require("chance");

class EventsSelector {
  constructor(
    normalEvents,
    unusualEvents,
    probabilityOfUnusualEvents = 25,
    occurredEvents = []
  ) {
    this.normalEvents = normalEvents;
    this.unusualEvents = unusualEvents;
    this.probabilityOfUnusualEvents = probabilityOfUnusualEvents;

    this.occurredEvents = occurredEvents;
  }

  _getRandom(max) {
    return Chance().integer({ min: 0, max });
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

    const selectedEventIndex = this._getRandom(events.length - 1);
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

  setOccurredEvents(occurredEvents) {
    this.occurredEvents = occurredEvents;
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
          currentEvent.maximumOccurrences -= 1;

          this.occurredEvents = this._removeEventFromList(
            this.occurredEvents,
            currentEvent
          );

          this.occurredEvents.push(currentEvent);

          return [currentEvent, this.occurredEvents];
        }

        return this.processEvent(this.occurredEvents);
      }

      if (selectedEvent.maximumOccurrences <= 0) {
        return this.processEvent(this.occurredEvents);
      }

      selectedEvent.maximumOccurrences -= 1;
    }

    this.occurredEvents.push(selectedEvent);
    return [selectedEvent, this.occurredEvents];
  }
}

module.exports = EventsSelector;
