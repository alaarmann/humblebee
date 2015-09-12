/*
 * Humblebee FSM
 * FiniteStateMachine module
*/

/*jslint         browser : false, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global module */

module.exports = (function () {
  'use strict';

  var allEventIds = {};
  var retrieveStateIds = function(spec){
    var result = [];
    var stateId;
    for (stateId in spec.states){
      if (spec.states.hasOwnProperty(stateId)){
        result.push(stateId);
      }
    }
    return result;
  };

  var retrieveEventIds = function(spec){
    var result = [];
    var eventId;
    for (eventId in spec.events){
      if (spec.events.hasOwnProperty(eventId)){
        result.push(eventId);
      }
    }
    return result;
  };

  var create = function ( aSpecification ) {
    var stateIds = [];
    var fsm = {};
    var specification = aSpecification;
    console.log ('create() called');


    var createEventHandler = function (action, nextStateId){
      return function (){
        // action
        var result = action.apply(this, arguments);
        // transition
        if (nextStateId) {
          fsm.currentState = fsm[nextStateId];
        }
        return result;
      };
    };

    var createEventDelegation = function (eventid){
      console.log('createEventDelegation, eventid=' + eventid);
      return function (){
        return typeof fsm.currentState[eventid] === 'function' ? fsm.currentState[eventid].apply(this, arguments) : (function () {console.log('No operation');})();
      };
    };

    var createProxy = function (){
      var result = {};

      result.getId = function () {
        return fsm.currentState.id;
      };

      for (var each in allEventIds) {
        if (allEventIds.hasOwnProperty(each)) {
          var handlerName = each;
          result[handlerName] = createEventDelegation(handlerName); 
        }
      }
      return result;
    };

    stateIds = retrieveStateIds (specification);
    var eachState;
    var initialStateId;
    for (var i=0; i < stateIds.length;i++){
      eachState = stateIds[i];
      console.log ('eachState=' + eachState);
      fsm[eachState] = { id : eachState};
      if (specification.states[eachState].initial){
        initialStateId = eachState;
      }
      var eventIds = retrieveEventIds (specification.states[eachState]);
      var eachEvent;
      for (var u=0 ;u < eventIds.length;u++){
        eachEvent = eventIds[u];
        console.log ('eachEvent=' + eachEvent);
        console.log ('EventHandlerName=' + eachEvent);
        fsm[eachState][eachEvent] = createEventHandler (specification['states'][eachState]['events'][eachEvent]['action'], 
                                                                                specification['states'][eachState]['events'][eachEvent]['transition']);
	allEventIds[eachEvent] = 1; 
      }
    }

    // initial state
    fsm.currentState = initialStateId ? fsm[initialStateId] : stateIds[0];
    return createProxy();
  };

  return create;
}());
