/*
 * test.js
 * UnitTests for Humblebee FiniteStateMachine module
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global require, exports */

var createFsm = require('../main');

var createFsmSpecification = function () {
  var unlock = function () {
    console.log('unlock() called.');
  };
  var alarm = function () {
    console.log('alarm() called.');
  };
  var thankYou = function () {
    console.log('thankYou() called.');
  };
  var lock = function () {
    console.log('lock() called.');
  };

  var turnstyleFsmSpecification = {
    'states' : {
      'Locked' : {
        'initial' : true,
        'events' : {
          'insertCoin' : {
            'transition' : 'Unlocked',
            'action' : unlock
          },
          'passThrough' : {
            'transition' : undefined,
            'action' : alarm
          }
        }
      },
      'Unlocked' : {
        'events' : {
          'insertCoin' : {
            'transition' : undefined,
            'action' : thankYou
          },
          'passThrough' : {
            'transition' : 'Locked',
            'action' : lock
          }
        }
      }
    }
  };

  return turnstyleFsmSpecification;
};

exports['createFsm'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);
  var initialStateId = 'Locked';
  test.equal(turnstyleState.getId(), initialStateId, 'Initial state is ' + initialStateId);
  test.done();
};

exports['statesAndTransitions'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');


  test.done();
};

exports['modifySpecAfter'] = function (test) {
  var turnstyleFsmSpecification = createFsmSpecification();
  var turnstyleState = createFsm(turnstyleFsmSpecification);

  // modification after creation must not have any influence on fsm
  turnstyleFsmSpecification.states.Locked = {};
  turnstyleFsmSpecification.states.Unlocked = {};


  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.insertCoin();
  test.equal(turnstyleState.getId(), 'Unlocked');
  turnstyleState.passThrough();
  test.equal(turnstyleState.getId(), 'Locked');


  test.done();
};
