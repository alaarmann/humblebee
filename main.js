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

  var create = function ( aSpecification ) {
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

      createCollection(specification.states).forEach(function(state){

          createCollection(state['events']).forEachKey(function(eventId){
            result[eventId] = createEventDelegation(eventId);
          });
       });
      return result;
    };

    var createCollection = function (plainObject){
      var result = {};

      result.forEach = function (functionArg, thisArg) {
        var thisToUse = typeof thisArg !== 'undefined' ? thisArg : this ;
        var each ;

        for (each in plainObject) {
          if (!plainObject.hasOwnProperty(each)) {
            continue;
          }
	  functionArg.apply(thisToUse, [plainObject[each]]);
        }
        return result;
      };

      result.forEachKey = function (functionArg, thisArg) {
        var thisToUse = typeof thisArg !== 'undefined' ? thisArg : this ;
        var each ;

        for (each in plainObject) {
          if (!plainObject.hasOwnProperty(each)) {
            continue;
          }
	  functionArg.apply(thisToUse, [each]);
        }
        return result;
      };

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

      result.forFirstValue = function (functionArg, thisArg) {
        var thisToUse = typeof thisArg !== 'undefined' ? thisArg : this ;
        var each ;

        for (each in plainObject) {
          if (!plainObject.hasOwnProperty(each)) {
            continue;
          }
	  functionArg.apply(thisToUse, [plainObject[each]]);
          break;
        }
        return result;
      };

      return result;
    };

    var processStateSpec = function(stateId, state){
      var processEventSpec = function(eventId, event){
        fsm[stateId][eventId] = createEventHandler(event['action'], event['transition']);        
      };
      fsm[stateId] = { id : stateId};
      if (state.initial && typeof fsm.currentState === 'undefined'){
        fsm.currentState = fsm[stateId];
      }
      createCollection(state['events']).forEachEntry(processEventSpec);
    };
    createCollection(specification.states).forEachEntry(processStateSpec);

    // default initial state
    if (typeof fsm.currentState === 'undefined'){
      createCollection(specification.states).forFirstValue(function(state){
        fsm.currentState = state;
      });
    }
    return createProxy();
  };

  return create;
}());
