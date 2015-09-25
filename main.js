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

      result.getCurrentState = function () {
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

    var createCollection = function (plainObject){
      var result = {};

      result.forEachEntry = function (functionArg, thisArg) {
        var thisToUse = typeof thisArg !== 'undefined' ? thisArg : this ;
        var each ;

        for (each in plainObject) {
          if (!plainObject.hasOwnProperty(each)) {
            continue;
          }
	  functionArg.apply(thisToUse, [each, plainObject[each]]);
        }
        return result;
      };

      return result;
    };

    stateIds = retrieveStateIds (specification);

    var initialStateId;
    var processStateSpec = function(stateId, state){
      var processEventSpec = function(eventId, event){
        fsm[stateId][eventId] = createEventHandler(event['action'], event['transition']);        
        allEventIds[eventId] = 1; 
      };
      fsm[stateId] = { id : stateId};
      if (state.initial && typeof fsm.currentState === 'undefined'){
        fsm.currentState = fsm[stateId];
      }
      createCollection(state['events']).forEachEntry(processEventSpec);
    };
    createCollection(specification.states).forEachEntry(processStateSpec);

    // initial state
    if (typeof fsm.currentState === 'undefined'){
      fsm.currentState = initialStateId ? fsm[initialStateId] : stateIds[0];
    }
    return createProxy();
  };

  return create;
}());
